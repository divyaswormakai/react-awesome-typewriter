import React from "react";
import "./index.css";
export interface IReactAwesomeTypewriterText {
    text: string;
    classNames?: string;
}
export interface IReactAwesomeTypewriter {
    options: IReactAwesomeTypewriterText[][];
    forwardSpeed?: number;
    waitTime?: number;
    backwardSpeed?: number;
    cursorColor?: string;
    cursorHeight?: string;
    cursorWidth?: string;
    cursorGap?: string;
    cursorAnimationDuration?: number;
}
declare const ReactAwesomeTypewriter: React.FC<IReactAwesomeTypewriter>;
export default ReactAwesomeTypewriter;
