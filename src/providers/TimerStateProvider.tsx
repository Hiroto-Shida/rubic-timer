import { createContext, ReactNode, useEffect, useRef, useState } from "react";
import { useKeyEvent } from "../hooks/useKeyEvent";

export type TimerState = {
  isStarted: boolean; // タイマーがスタートしたか
  startingState: StartingState; // spaceキーを押した時の処理
};
export type StartingState = {
  isKeyDownSpace: boolean; // spaceキーを押してる状態か
  isCanStart: boolean; // spaceキーを一定時間押して、離したらタイマースタートできる状態か
};

const initialTimerState: TimerState = {
  isStarted: false,
  startingState: {
    isKeyDownSpace: false,
    isCanStart: false,
  },
};

export const TimerStateContext = createContext<TimerState>(initialTimerState);

type Props = {
  children: ReactNode;
};

export const TimerStateProvider = ({ children }: Props) => {
  const [timerState, setTimerState] = useState<TimerState>(initialTimerState);
  const isKeyDownSpaceInPause = useRef<boolean>(false);

  const {
    isKeyDownSpaceStart,
    isCanStartByKeyUpSpace,
    isKeyUpSpaceHeldAndReleased,
  } = useKeyEvent();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // spaceキー押し始めの時
      if (isKeyDownSpaceStart(e)) {
        if (!timerState.isStarted) {
          isKeyDownSpaceInPause.current = true;
          setTimerState((preTimerState) => ({
            ...preTimerState,
            startingState: {
              isKeyDownSpace: true,
              isCanStart: false,
            },
          }));
          return;
        }

        if (timerState.isStarted) {
          isKeyDownSpaceInPause.current = false;
          setTimerState((preTimerState) => ({
            ...preTimerState,
            isStarted: false,
            startingState: {
              isKeyDownSpace: true,
              isCanStart: false,
            },
          }));
          return;
        }
      }

      // タイマーが停止した画面から、spaceキー押してから一定時間経過した時
      if (!timerState.isStarted && isKeyDownSpaceInPause.current) {
        if (isCanStartByKeyUpSpace(e)) {
          setTimerState((preTimerState) => ({
            ...preTimerState,
            startingState: {
              isKeyDownSpace: true,
              isCanStart: true,
            },
          }));
        }
        return;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // タイマーが停止した画面から、spaceキーを一定時間押した後、キーを話したとき
      if (isKeyUpSpaceHeldAndReleased(e) && isKeyDownSpaceInPause.current) {
        if (!timerState.isStarted) {
          setTimerState((preTimerState) => ({
            ...preTimerState,
            isStarted: true,
          }));
        }
      }
      setTimerState((preTimerState) => ({
        ...preTimerState,
        startingState: {
          isKeyDownSpace: false,
          isCanStart: false,
        },
      }));
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    isCanStartByKeyUpSpace,
    isKeyDownSpaceStart,
    isKeyUpSpaceHeldAndReleased,
    timerState.isStarted,
  ]);

  return (
    <TimerStateContext.Provider value={timerState}>
      {children}
    </TimerStateContext.Provider>
  );
};