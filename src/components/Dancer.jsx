import {
    useGLTF,
    useAnimations,
    useScroll,
    Box,
    Circle,
    Points,
    useTexture
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect, useMemo } from "react";
import { useRecoilValue } from "recoil";
import { IsEnteredAtom } from "../stores/index.js";
import { Loader } from "./Loader.jsx";
import gsap from "gsap";
import * as THREE from "three";

let timeline;
const colors = {
    boxMaterialColor: "#DC4F00"
};
export const Dancer = () => {
    const three = useThree();
    const isEntered = useRecoilValue(IsEnteredAtom);
    const dancerRef = useRef(null);
    const boxRef = useRef(null);
    const startGroupRef01 = useRef(null);
    const startGroupRef02 = useRef(null);
    const startGroupRef03 = useRef(null);
    const rectAreaLightRef = useRef(null);
    const hemisphereLightRef = useRef(null);

    const { scene, animations } = useGLTF("/models/dancer.glb");
    const texture = useTexture("/texture/5.png");

    const { actions } = useAnimations(animations, dancerRef);

    const { positions } = useMemo(() => {
        const count = 500;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 25;
        }
        return { positions };
    }, []);

    const scroll = useScroll();

    useFrame(() => {
        if (!isEntered) return;

        timeline.seek(scroll.offset * timeline.duration());
    });

    useEffect(() => {
        if (!isEntered) return;

        actions["wave"].play();
    }, [actions, isEntered]);

    useEffect(() => {
        if (!isEntered) return;
        if (!dancerRef.current) return;

        gsap.fromTo(
            three.camera.position,
            {
                x: -5,
                y: 5,
                z: 5
            },
            {
                duration: 2.5,
                x: 0,
                y: 6,
                z: 12
            }
        );
        gsap.fromTo(
            three.camera.rotation,
            {
                z: Math.PI
            },
            {
                duration: 2.5,
                z: 0
            }
        );
    }, [isEntered, three.camera.position]);

    useEffect(() => {
        if (!isEntered) return;
        if (!dancerRef.current) return;
        timeline = gsap.timeline();
        timeline
            .from(
                dancerRef.current.rotation,
                {
                    duration: 4,
                    y: -4 * Math.PI
                },
                0.5
            )
            .from(
                dancerRef.current.position,
                {
                    duration: 4,
                    x: 3
                },
                "<" // same option with previous .from()
            )
            .to(
                three.camera.position,
                {
                    duration: 10,
                    x: 2,
                    z: 8
                },
                "<"
            )
            .to(three.camera.position, {
                duration: 10,
                x: 0,
                z: 6
            })
            .to(three.camera.position, {
                duration: 10,
                x: 0,
                z: 16
            });
    }, [isEntered, three.camera.position]);

    if (isEntered) {
        return (
            <>
                <primitive ref={dancerRef} object={scene} scale={0.05} />
                <ambientLight intensity={2} />
                <rectAreaLight
                    ref={rectAreaLightRef}
                    position={[0, 10, 0]}
                    intensity={30}
                />
                <pointLight
                    position={[0, 5, 0]}
                    intensity={45}
                    castShadow
                    receiveShadow
                />
                <hemisphereLight
                    ref={hemisphereLightRef}
                    position={[0, 5, 0]}
                    intensity={0}
                    groundColor={"lime"}
                    color="blue"
                />

                <Box ref={boxRef} position={[0, 0, 0]} args={[100, 100, 100]}>
                    <meshStandardMaterial
                        color={"#DC4F00"}
                        side={THREE.DoubleSide}
                    />
                </Box>

                <Circle
                    castShadow
                    receiveShadow
                    args={[8, 32]}
                    rotation-x={-Math.PI / 2}
                    position-y={-4.4}
                >
                    <meshStandardMaterial
                        color={"#DC4F00"}
                        side={THREE.DoubleSide}
                    />
                </Circle>

                <Points positions={positions.slice(0, positions.length / 3)}>
                    <pointsMaterial
                        ref={startGroupRef01}
                        size={0.5}
                        color={new THREE.Color("#DC4F00")}
                        sizeAttenuation
                        depthWrite
                        alphaMap={texture}
                        transparent
                        alphaTest={0.001}
                    />
                </Points>
                <Points
                    positions={positions.slice(
                        positions.length / 3,
                        (positions.length * 2) / 3
                    )}
                >
                    <pointsMaterial
                        ref={startGroupRef02}
                        size={0.5}
                        color={new THREE.Color("#DC4F00")}
                        sizeAttenuation
                        depthWrite
                        alphaMap={texture}
                        transparent
                        alphaTest={0.001}
                    />
                </Points>
                <Points
                    positions={positions.slice(
                        (positions.length * 2) / 3,
                        positions.length
                    )}
                >
                    <pointsMaterial
                        ref={startGroupRef03}
                        size={0.5}
                        color={new THREE.Color("#DC4F00")}
                        sizeAttenuation
                        depthWrite
                        alphaMap={texture}
                        transparent
                        alphaTest={0.001}
                    />
                </Points>
            </>
        );
    }

    return <Loader isCompleted />;
};
