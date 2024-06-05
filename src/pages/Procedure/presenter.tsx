import { Step1 } from "../../components/procedure/Step1/container";
import { Step2 } from "../../components/procedure/Step2/container";
import { Step3 } from "../../components/procedure/Step3/container";

type Props = {
  step: string | undefined;
};

export const ProcedurePagePresenter = ({ step }: Props) => {
  return (
    <>
      {step === "1" && <Step1 />}
      {step === "2" && <Step2 />}
      {step === "3" && <Step3 />}
    </>
  );
};
