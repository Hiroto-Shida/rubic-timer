import { BodyTypography as B } from "../../parts/BodyTypography/container";
import { TitleTypography as T } from "../../parts/TitleTypography/container";
import { SubTitleTypography as ST } from "../../parts/SubTitleTypography/container";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { StyledRubicModel } from "../StyledRubicModel/container";
import { StyledScrambleModels } from "../StyledScrambleModels/container";
import { BorderBox } from "../BorderBox/container";

export const Step2Presenter = () => {
  return (
    <>
      <T pageTop={true}>ステップ2：完全1面を作ろう</T>
      <B>以下がステップ2の完成形です。</B>
      <B> ↓ マウスで動かして全体像を確認しよう！</B>
      <StyledRubicModel
        status="F1L"
        canvasCamera={{ position: [2.5, -2.7, 2.5] }}
        isRotate={true}
      />

      <T>白のコーナーキューブの揃え方</T>
      <ST>※このステップからは基本的に白面を下にしてキューブを回します。</ST>
      <B>まずは本ステップで揃えたい、白のコーナーキューブを探しましょう。</B>
      <B>キューブを見つけたら、入れたい箇所の手前に持っていきましょう</B>
      <B>
        例えば下の例のように、白(青,赤)のコーナーキューブを見つけたら、[青赤]の面の境目の上部に移動させましょう
      </B>
      <StyledScrambleModels
        status="F1L_READY"
        scrambleList={["", "U", ""]}
        isKeepRotate={true}
      />
      <B>これで準備OK！</B>

      <B>
        そこから揃えるために大きく3パターンの状況があります。該当するパターンを見つけその手順で揃えていきましょう
      </B>
      <BorderBox>
        <ST>
          パターン1：白面が横を向いており、白面の位置が横の面の[左]側にある場合
        </ST>
        <B>
          ※白面を手前にした時に回す向きが「→↑←↓」なので"左回り"のセクシーと覚えましょう
        </B>
        <StyledScrambleModels
          status="F1L_SIDE_EX1"
          supportTextList={["左回りの,逆セクシー"]}
          scrambleList={["", "(", "U'", "L'", "U", "L", ")", ""]}
          isKeepRotate={true}
          lookfromRight={false}
        />
        <ST>
          パターン2：白面が横を向いており、白面の位置が横の面の[右]側にある場合
        </ST>
        <B>
          ※白面を手前にした時に回す向きが「←↑→↓」なので"右回り"のセクシーと覚えましょう
        </B>
        <StyledScrambleModels
          status="F1L_SIDE_EX2"
          supportTextList={["右回りの,逆セクシー"]}
          scrambleList={["", "(", "U", "R", "U'", "R'", ")", ""]}
          isKeepRotate={true}
        />
      </BorderBox>
      <BorderBox>
        <ST>パターン3：白面が上を向いている場合</ST>
        <B>
          揃え方は様々ですが、左回りor右回りの逆セクシーを3回繰り返すことで揃えられます。脳死で覚えるならこれがオススメです
        </B>
        <B>
          ※この時、入れたいコーナーキューブの位置を[右]側にして持った時は「右回りの逆セクシー」、[左]側にして持った時は「左回りの逆セクシー」を3回回しましょう
        </B>
        <StyledScrambleModels
          status="F1L_SIDE_EX3"
          supportTextList={[
            "右回りの,逆セクシー",
            "右回りの,逆セクシー",
            "右回りの,逆セクシー",
          ]}
          scrambleList={[
            "",
            "(",
            "U",
            "R",
            "U'",
            "R'",
            ")",
            "(",
            "U",
            "R",
            "U'",
            "R'",
            ")",
            "(",
            "U",
            "R",
            "U'",
            "R'",
            ")",
            "",
          ]}
          isKeepRotate={true}
        />
      </BorderBox>

      <T>下の段に白コーナーキューブがある場合</T>
      <B>上段に白コーナーキューブがない場合は、下段にあるはずです</B>
      <B>
        下段にあるけど、下面の白は揃ってない場合はセクシームーブをしましょう
      </B>
      <BorderBox>
        <ST>
          とりあえず右回りor左回りの逆セクシーで、揃えた面を崩さずに上段へ移動可能
        </ST>
        <StyledScrambleModels
          status="F1L_WHITE_IN_BOTTOM"
          supportTextList={["右回りの,逆セクシー"]}
          scrambleList={["", "(", "U", "R", "U'", "R'", ")", ""]}
          isKeepRotate={true}
        />
        <B>後は、パターン1,2,3で揃えることができますね！</B>
      </BorderBox>

      <B>
        以上の、1.入れたいキューブを手前に持ってくる。2.左回りor右回りの逆セクシーで揃える。を最大でも4箇所繰り返すことで、下4箇所の白コーナーキューブが揃い、完全一面が揃います
      </B>
      <StyledRubicModel
        status="F1L"
        canvasCamera={{ position: [2.5, -2.7, 2.5] }}
        isRotate={true}
      />

      <B>
        無事完全一面が揃えられたら、次の
        <Typography
          component={Link}
          to="/procedure/3"
          sx={{ fontWeight: "bold" }}
        >
          ステップ3
        </Typography>
        に進みましょう！
      </B>

      <Box component="div" sx={{ height: "200px" }}></Box>
    </>
  );
};
