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
  typeWriterId?: string;
}

const ReactAwesomeTypewriter: React.FC<IReactAwesomeTypewriter> = ({
  options,
  forwardSpeed = 60,
  waitTime = 4000,
  backwardSpeed = 25,
  cursorColor = "#FFF",
  cursorHeight = "2.25rem",
  cursorWidth = "3px",
  cursorGap = "10px",
  cursorAnimationDuration = 700,
  typeWriterId = `react-awesome-typewriter-${Date.now()}`,
}) => {
  const [allOptions] = React.useState(options);
  const [activeIndex, setActiveIndex] = React.useState<number>(-1);
  const [totalTextLength, setTotalTextLength] = React.useState<number>(0);
  const [textSpans, setTextSpans] = React.useState<string[]>([]);
  const [isBackspacing, setIsBackspacing] = React.useState<boolean>(false);

  React.useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      #${typeWriterId}::after{
        background-color: ${cursorColor};
        height: ${cursorHeight};
        width: ${cursorWidth};
        margin-left: ${cursorGap};
        animation-duration: ${cursorAnimationDuration}ms;
        content: "";
        display: inline-block;
        animation-name: blink;
        animation-iteration-count: infinite;
      }
    `;

    document.head.appendChild(style);
  }, [
    cursorColor,
    cursorHeight,
    cursorWidth,
    cursorGap,
    cursorAnimationDuration,
  ]);

  React.useEffect(() => {
    if (activeIndex === -1) {
      setActiveIndex(0);
      return;
    }
    const currentText = allOptions[activeIndex];
    setTotalTextLength(0);
    setTextSpans([]);

    const calculatedTextLength = currentText
      .map((item) => item.text)
      .reduce((accumulator, item) => accumulator + item.length, 0);
    setTotalTextLength(calculatedTextLength);

    startWriting();
  }, [activeIndex]);

  React.useEffect(() => {
    calculateWritingText();
  }, [textSpans]);

  const calculateWritingText = async () => {
    if (textSpans.length > 0) {
      if (textSpans.length >= totalTextLength) {
        setIsBackspacing(true);
        setTimeout(() => {
          startDeleting();
        }, waitTime);
        return;
      }

      if (!isBackspacing) {
        startWriting();
      } else {
        startDeleting();
      }
    }
    if (isBackspacing && textSpans.length <= 0) {
      setIsBackspacing(false);

      setActiveIndex((previous) =>
        options.length === 1 ? -1 : (previous + 1) % allOptions.length
      );
    }
  };

  const startWriting = () => {
    setTimeout(() => {
      const currentText = allOptions[activeIndex];
      const currentSpansLength = textSpans.length;
      // Figure out which text section does current render belong to
      let textSection = currentText[0];
      let totalText = 0;
      let index = 0;
      for (const item of currentText) {
        totalText += item.text.length;
        if (currentSpansLength < totalText) {
          textSection = currentText[index];
          break;
        }
        index += 1;
      }

      const letter =
        textSection.text[
          Math.abs(textSection.text.length - (totalText - currentSpansLength))
        ];
      setTextSpans((previous) => [
        ...previous,
        `<span class="${textSection?.classNames ?? ""}">${letter}</span>`,
      ]);
    }, forwardSpeed);
  };

  const startDeleting = () => {
    setTimeout(() => {
      setTextSpans((previous) => {
        previous.pop();
        return [...previous];
      });
    }, backwardSpeed);
  };

  return (
    <span
      className="react-awesome-typewriter mb-4 min-h-[110px] flex-wrap text-3xl font-bold sm:min-h-[150px] md:min-h-[120px] md:w-2/3 md:text-5xl md:leading-[3.75rem]"
      id={typeWriterId}
      dangerouslySetInnerHTML={{
        __html: textSpans?.length > 0 ? textSpans.join("") : "",
      }}
    ></span>
  );
};

export default ReactAwesomeTypewriter;
