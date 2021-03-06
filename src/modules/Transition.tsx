import { useRef, useEffect, createContext, useContext } from "react"
import { CSSTransition as ReactCSSTransition } from "react-transition-group"

interface ITransitionContext {
    parent: any
}
const TransitionContext = createContext<ITransitionContext>({
    parent: {},
})

function useIsInitialRender() {
    const isInitialRender = useRef(true)
    useEffect(() => {
        isInitialRender.current = false
    }, [])
    return isInitialRender.current
}

interface ICssTransition {
    children?: any
    show?: any
    appear?: any
    unmountOnExit?: any
    tag?: string
    enter?: string
    enterStart?: string
    enterEnd?: string
    leave?: string
    leaveStart?: string
    leaveEnd?: string
    id?: string
    className?: string
    role?: string
}

function CSSTransition({
    show,
    enter = "",
    enterStart = "",
    enterEnd = "",
    leave = "",
    leaveStart = "",
    leaveEnd = "",
    appear,
    unmountOnExit,
    tag = "div",
    children,
    ...rest
}: Partial<ICssTransition>) {
    const enterClasses = enter.split(" ").filter((s) => s.length)
    const enterStartClasses = enterStart.split(" ").filter((s) => s.length)
    const enterEndClasses = enterEnd.split(" ").filter((s) => s.length)
    const leaveClasses = leave.split(" ").filter((s) => s.length)
    const leaveStartClasses = leaveStart.split(" ").filter((s) => s.length)
    const leaveEndClasses = leaveEnd.split(" ").filter((s) => s.length)
    const removeFromDom = unmountOnExit

    function addClasses(node: any, classes: any) {
        classes.length && node.classList.add(...classes)
    }

    function removeClasses(node: any, classes: any) {
        classes.length && node.classList.remove(...classes)
    }

    const nodeRef: any = useRef(null)
    const Component: any = tag

    return (
        <ReactCSSTransition
            appear={appear}
            nodeRef={nodeRef}
            unmountOnExit={removeFromDom}
            in={show}
            addEndListener={(done: any) => {
                nodeRef.current.addEventListener("transitionend", done, false)
            }}
            onEnter={() => {
                if (!removeFromDom) nodeRef.current.style.display = null
                addClasses(nodeRef.current, [...enterClasses, ...enterStartClasses])
            }}
            onEntering={() => {
                removeClasses(nodeRef.current, enterStartClasses)
                addClasses(nodeRef.current, enterEndClasses)
            }}
            onEntered={() => {
                removeClasses(nodeRef.current, [...enterEndClasses, ...enterClasses])
            }}
            onExit={() => {
                addClasses(nodeRef.current, [...leaveClasses, ...leaveStartClasses])
            }}
            onExiting={() => {
                removeClasses(nodeRef.current, leaveStartClasses)
                addClasses(nodeRef.current, leaveEndClasses)
            }}
            onExited={() => {
                removeClasses(nodeRef.current, [...leaveEndClasses, ...leaveClasses])
                if (!removeFromDom) nodeRef.current.style.display = "none"
            }}
        >
            <Component ref={nodeRef} {...rest} style={{ display: !removeFromDom ? "none" : "" }}>
                {children}
            </Component>
        </ReactCSSTransition>
    )
}

export default function Transition({ show, appear, ...rest }: Partial<ICssTransition>) {
    const { parent } = useContext(TransitionContext)
    const isInitialRender = useIsInitialRender()
    const isChild = show === undefined

    if (isChild) {
        return (
            <CSSTransition
                appear={parent.appear || !parent.isInitialRender}
                show={parent.show}
                {...rest}
            />
        )
    }

    return (
        <TransitionContext.Provider
            value={{
                parent: {
                    show,
                    isInitialRender,
                    appear,
                },
            }}
        >
            <CSSTransition appear={appear} show={show} {...rest} />
        </TransitionContext.Provider>
    )
}
