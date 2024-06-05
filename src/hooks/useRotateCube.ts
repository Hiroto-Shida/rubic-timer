import * as THREE from "three";
import { MutableRefObject, useCallback } from "react";
import { Axis, Limit, Multiplier } from "../components/rubicModel/rotateDirection";

export const useRotateCube = () => {
  const resetCubeGroup = (cubeGroupRef: THREE.Group, rotationGroupRef: THREE.Group) => {
    rotationGroupRef.children
      .slice()
      // .reverse() // いらない？
      .forEach((c) => {
        const objectPosition = new THREE.Vector3();
        c.getWorldPosition(objectPosition);
        cubeGroupRef.attach(c);
      });
    // MAYBE: 上記の処理でrotationGroupの中を空にしてからrotationリセット?
    // rotationGroupRef.quaternion.set(0, 0, 0, 1); // どっちもかわらなそう
    rotationGroupRef.rotation.set(0, 0, 0); // どっちもかわらなそう
  };

  const attachToRotationGroup = (
    cubeGroupRef: THREE.Group,
    rotationGroupRef: THREE.Group,
    cubeGroupPosition: number[],
    axis: Axis,
    limit: Limit | undefined,
    isHighlightRotateGroup: boolean
  ) => {
    cubeGroupRef.children
      .slice()
      .reverse()
      .filter((c: THREE.Object3D<THREE.Object3DEventMap>) => {
        const isRotateCube = limit
          ? limit < 0
            ? c.position[axis] < limit
            : c.position[axis] > limit
          : true;
        if (isHighlightRotateGroup && !isRotateCube) {
          const mesh = c.children[0] as THREE.Mesh;
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((material) =>
              (material as THREE.MeshBasicMaterial).color.set("#777777")
            );
          }
        }
        return isRotateCube;
      })
      .forEach((c) => {
        rotationGroupRef.position.set(
          cubeGroupPosition[0],
          cubeGroupPosition[1],
          cubeGroupPosition[2]
        );
        rotationGroupRef.attach(c);
      });
  };

  const rotateGroup = (
    cubeGroupRef: THREE.Group,
    rotationGroupRef: THREE.Group,
    // lookfromRightRef: MutableRefObject<boolean>,
    changeLookFrom: () => void,
    axis: Axis,
    limit: Limit | undefined,
    multiplier: Multiplier,
    isMoveTwice: boolean,
    isMoveMaximum: boolean
  ) => {
    if (isMoveMaximum) {
      const rotateAngle = isMoveTwice ? Math.PI : Math.PI / 2;
      rotationGroupRef.rotation[axis] += rotateAngle * multiplier;
    } else {
      rotationGroupRef.rotation[axis] += (Math.PI / 6) * multiplier;
    }
    rotationGroupRef.position.set(
      Math.round(rotationGroupRef.position.x),
      Math.round(rotationGroupRef.position.y),
      Math.round(rotationGroupRef.position.z)
    );
    console.log(`${axis}, ${limit}`);
    if (axis === "y" && !limit) {
      console.log("changeLookFrom");
      // cubeGroupRef.rotation.set(Math.PI / 6, ((lookfromRightRef ? 1 : -1) * Math.PI) / 8, 0);
      // lookfromRightRef.current = !lookfromRightRef.current;
      changeLookFrom();
      // console.log(lookfromRightRef);
    }
  };

  const addArrow = (
    cubeGroupRef: THREE.Group,
    rotationGroupRef: THREE.Group,
    rotateAxis: Axis,
    limit: Limit | undefined,
    multiplier: Multiplier
  ) => {
    console.log("add arrow");
    const cubeGroupPosVec = new THREE.Vector3();
    cubeGroupRef.getWorldPosition(cubeGroupPosVec);

    const targetPosListAddArrow: { pos: number[]; arrow: THREE.Group }[] = [];

    rotationGroupRef.children.forEach((child) => {
      if (child instanceof THREE.Group) {
        // child.quaternion.set(0, 0, 0, 1);
        const coneGeometry = new THREE.ConeGeometry(0.4, 1, 10);
        const cylinderGeometry = new THREE.CylinderGeometry(0.15, 0.15, 2.3, 10);

        const meshColor = "#6bcacd";
        const lineColor = "#000000";
        const meshMaterial = new THREE.MeshStandardMaterial({
          color: meshColor,
          emissive: meshColor,
        });
        const lineMaterial = new THREE.MeshStandardMaterial({
          color: lineColor,
          emissive: lineColor,
        });

        const arrowGroup = new THREE.Group();

        const coneMesh = new THREE.Mesh(coneGeometry, meshMaterial);
        const coneWireframe = new THREE.WireframeGeometry(coneGeometry);
        const coneLine = new THREE.LineSegments(coneWireframe, lineMaterial);
        coneMesh.position.setY(1);
        coneLine.position.setY(1);

        const cylinderMesh = new THREE.Mesh(cylinderGeometry, meshMaterial);
        const cylinderWireframe = new THREE.WireframeGeometry(cylinderGeometry);
        const cylinderLine = new THREE.LineSegments(cylinderWireframe, lineMaterial);
        cylinderMesh.position.setY(-0.2);
        cylinderLine.position.setY(-0.2);

        arrowGroup.add(coneMesh);
        arrowGroup.add(coneLine);
        arrowGroup.add(cylinderMesh);
        arrowGroup.add(cylinderLine);

        // const distanceFromSurface = 1 * Math.sign(limit ?? 0.5); // limit=undefinedの時はlimit=0.5と同じなので0.5

        // 原点からの絶対座標から、各キューブの中心からの相対座標childPosに変換
        const childWorldPosVec = new THREE.Vector3();
        const childWorldDirVec = new THREE.Vector3();
        child.getWorldPosition(childWorldPosVec);
        child.getWorldDirection(childWorldDirVec);
        const childPosVec = new THREE.Vector3().subVectors(childWorldPosVec, cubeGroupPosVec);
        const childPos = childPosVec.toArray().map((pos) => Math.round(pos));

        const originAxis = ["x", "y", "z"];
        const excludeRotateAxis = originAxis.filter((axis) => axis !== rotateAxis);

        // 矢印をつける対象のCubeの場合、isTargetAddArrow = true
        let isTargetAddArrow;
        if (limit) {
          if (Math.sign(limit) == 1) {
            isTargetAddArrow =
              childPos.filter((pos) => pos === 1).length == 2 &&
              childPos.filter((pos) => pos === 0).length == 1;
          } else {
            isTargetAddArrow =
              childPos.filter((pos) => pos === 1).length == 1 &&
              childPos.filter((pos) => pos === -1).length == 1 &&
              childPos.filter((pos) => pos === 0).length == 1;
          }
        } else {
          if (rotateAxis === "y") {
            isTargetAddArrow = childPos[0] + childPos[2] === 1;
            // isTargetAddArrow && console.log(childPos);
          }
        }

        let zeroPosAxis = "";
        originAxis.forEach((axis) => {
          if (axis !== rotateAxis) zeroPosAxis = axis;
        });

        if (isTargetAddArrow) {
          // console.log("xyz----");
          // if (originAxis[childPos.indexOf(0)] === "x") {
          if (zeroPosAxis === "x") {
            // console.log("x");
            arrowGroup.position.set(
              childPos[0] * 2,
              // childPos[1] * 2 - (rotateAxis === "y" ? distanceFromSurface : 0),
              // childPos[2] * 2 - (rotateAxis === "z" ? distanceFromSurface : 0),
              childPos[1] * (rotateAxis === "z" ? 2 : 1),
              childPos[2] * (rotateAxis === "y" ? 2 : 1)
            );
          }
          // if (originAxis[childPos.indexOf(0)] === "y") {
          if (zeroPosAxis === "y") {
            // console.log("y");
            arrowGroup.position.set(
              // childPos[0] * 2 - (rotateAxis === "x" ? distanceFromSurface : 0),
              childPos[0] * (rotateAxis === "z" ? 2 : 1),
              childPos[1] * 2,
              // childPos[2] * 2 - (rotateAxis === "z" ? distanceFromSurface : 0)
              childPos[2] * (rotateAxis === "x" ? 2 : 1)
            );
          }
          // if (originAxis[childPos.indexOf(0)] === "z") {
          if (zeroPosAxis === "z") {
            // console.log("z");
            arrowGroup.position.set(
              // childPos[0] * 2 - (rotateAxis === "x" ? distanceFromSurface : 0),
              // childPos[1] * 2 - (rotateAxis === "y" ? distanceFromSurface : 0),
              childPos[0] * (rotateAxis === "y" ? 2 : 1),
              childPos[1] * (rotateAxis === "x" ? 2 : 1),
              childPos[2] * 2
            );
          }

          if (rotateAxis === "z") {
            if (childPos[0] === 0) {
              arrowGroup.rotation.z += (multiplier * Math.PI) / 2;
            } else {
              arrowGroup.rotation.z = multiplier === -1 ? Math.PI : 0;
            }
          }

          if (rotateAxis === "x") {
            if (childPos[2] === 0) {
              arrowGroup.rotation.x += (multiplier * Math.PI) / 2;
            } else {
              arrowGroup.rotation.x = multiplier === 1 ? Math.PI : 0;
            }
          }

          if (rotateAxis === "y") {
            if (childPos[0] === 0) {
              arrowGroup.rotation.z -= (multiplier * Math.PI) / 2;
            }
            if (childPos[2] === 0) {
              arrowGroup.rotation.x -= (multiplier * Math.PI) / 2;
            }
          }

          // if (rotateAxis === "z") {
          //   if (multiplier === -1) {
          //     arrowGroup.rotation.x = Math.PI;
          //   }
          //   if (originAxis[childPos.indexOf(0)] == "x") {
          //     arrowGroup.rotation.z += (multiplier * Math.PI) / 2;
          //   }
          // }

          // if (rotateAxis === "x") {
          //   if (multiplier === 1) {
          //     arrowGroup.rotation.x = Math.PI;
          //   }
          //   if (originAxis[childPos.indexOf(0)] == "z") {
          //     arrowGroup.rotation.x -= Math.PI / 2;
          //   }
          // }

          // if (rotateAxis === "y") {
          //   if (multiplier === 1) {
          //     arrowGroup.rotation.x = Math.PI;
          //   }
          //   if (originAxis[childPos.indexOf(0)] == "x") {
          //     arrowGroup.rotation.z -= (multiplier * Math.PI) / 2;
          //   }
          //   if (originAxis[childPos.indexOf(0)] == "z") {
          //     arrowGroup.rotation.x += Math.PI / 2;
          //   }
          // }

          arrowGroup.scale.set(0.9, 0.9, 0.9);
          targetPosListAddArrow.push({ pos: childPos, arrow: arrowGroup });
        }
      }
    });
    targetPosListAddArrow.forEach((target) => {
      rotationGroupRef.add(target.arrow);
    });
  };

  const rotate = useCallback(
    (
      cubeGroupRef: THREE.Group,
      rotationGroupRef: THREE.Group,
      // lookfromRightRef: MutableRefObject<boolean>,
      changeLookFrom: () => void,
      cubeGroupPosition: number[],
      rotateDirection: [Axis, Limit | undefined, Multiplier],
      isMoveTwice: boolean,
      isMoveMaximum: boolean,
      isHighlightRotateGroup: boolean
    ) => {
      const axis = rotateDirection[0];
      const limit = rotateDirection[1];
      const multiplier = rotateDirection[2];
      attachToRotationGroup(
        cubeGroupRef,
        rotationGroupRef,
        cubeGroupPosition,
        axis,
        limit,
        isHighlightRotateGroup
      );
      !isMoveMaximum && addArrow(cubeGroupRef, rotationGroupRef, axis, limit, multiplier);
      rotateGroup(
        cubeGroupRef,
        rotationGroupRef,
        // lookfromRightRef,
        changeLookFrom,
        axis,
        limit,
        multiplier,
        isMoveTwice,
        isMoveMaximum
      );
      resetCubeGroup(cubeGroupRef, rotationGroupRef);
    },
    []
  );

  return {
    rotate,
  } as const;
};
