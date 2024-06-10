import { Step1 } from "../../components/procedure/Step1/container";
import { Step2 } from "../../components/procedure/Step2/container";
import { Step3 } from "../../components/procedure/Step3/container";
import { Step4 } from "../../components/procedure/Step4/container";
import { Step5 } from "../../components/procedure/Step5/container";

type Props = {
  step: string | undefined;
};

export const ProcedurePagePresenter = ({ step }: Props) => {
  return (
    <>
      {step === "1" && <Step1 />}
      {step === "2" && <Step2 />}
      {step === "3" && <Step3 />}
      {step === "4" && <Step4 />}
      {step === "5" && <Step5 />}
    </>
  );
};
