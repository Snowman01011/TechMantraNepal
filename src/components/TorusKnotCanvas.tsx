import React, { useEffect, useRef } from "react";
import { ThemeType } from "../types";

interface TorusKnotCanvasProps {
  theme: ThemeType;
}

export default function TorusKnotCanvas({ theme }: TorusKnotCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // High performance: Track mouse coordinates & physics in a mutable ref to prevent React dependency retrigger storm
  const mouseRef = useRef({
    x: 0,
    y: 0,
    hover: false,
    lerpedX: 0,
    lerpedY: 0,
    currentScale: 1.0,
    targetScale: 1.0,
    currentSpinSpeed: 1.0,
    targetSpinSpeed: 1.0,
    hoverIntensity: 0.0,
    targetHoverIntensity: 0.0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = canvas.offsetWidth || canvas.parentElement?.offsetWidth || window.innerWidth || 800;
    let height = canvas.offsetHeight || canvas.parentElement?.offsetHeight || window.innerHeight || 600;
    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || canvas.parentElement?.offsetWidth || window.innerWidth || 800;
      height = canvas.height = canvas.offsetHeight || canvas.parentElement?.offsetHeight || window.innerHeight || 600;
      
      // Update particles native coordinate bounds when resized so they don't get trapped
      const partCols = 28;
      const partRows = 28;
      let idx = 0;
      for (let i = 0; i < partCols; i++) {
        for (let j = 0; j < partRows; j++) {
          if (particles[idx]) {
            const px = (width / (partCols - 1)) * i;
            const py = (height / (partRows - 1)) * j;
            particles[idx].ox = px;
            particles[idx].oy = py;
          }
          idx++;
        }
      }
    };

    window.addEventListener("resize", handleResize);

    // Grid nodes background points
    const particles: Array<{ x: number; y: number; ox: number; oy: number; size: number; alpha: number }> = [];
    const cols = 28;
    const rows = 28;
    
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const px = (width / (cols - 1)) * i;
        const py = (height / (rows - 1)) * j;
        particles.push({
          x: px,
          y: py,
          ox: px,
          oy: py,
          size: 1.2,
          alpha: 0.15 + Math.random() * 0.2
        });
      }
    }

    // Dynamic Trail particles that interact with the dotted canvas grid
    interface TrailParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      size: number;
    }
    const trail: TrailParticle[] = [];
    let lastTrackedX = mouseRef.current.x;
    let lastTrackedY = mouseRef.current.y;

    // 3D holographic Torus Knot generator
    const tubeSegments = 100;
    const radialSegments = 10;
    const tubeRadius = 0.22;
    const p = 2; // windings around axis
    const q = 3; // windings around core

    // Generate center spline points & Frenet frames
    const getKnotCenterPoint = (theta: number) => {
      const r = 1.05 + 0.42 * Math.cos(q * theta);
      const x = r * Math.cos(p * theta);
      const y = r * Math.sin(p * theta);
      const z = 0.42 * Math.sin(q * theta);
      return { x, y, z };
    };

    const meshPoints: Array<{ x: number; y: number; z: number }> = [];

    for (let i = 0; i < tubeSegments; i++) {
      const theta = (i / tubeSegments) * Math.PI * 2 * p;
      const curr = getKnotCenterPoint(theta);
      const next = getKnotCenterPoint(theta + 0.005);

      // Tangent
      const tx = next.x - curr.x;
      const ty = next.y - curr.y;
      const tz = next.z - curr.z;
      const tLen = Math.sqrt(tx*tx + ty*ty + tz*tz) || 1;
      const t = { x: tx / tLen, y: ty / tLen, z: tz / tLen };

      // Normal reference
      let rx = 0, ry = 1, rz = 0;
      if (Math.abs(t.y) > 0.9) {
        rx = 1; ry = 0; rz = 0;
      }
      const nx = t.y * rz - t.z * ry;
      const ny = t.z * rx - t.x * rz;
      const nz = t.x * ry - t.y * rx;
      const nLen = Math.sqrt(nx*nx + ny*ny + nz*nz) || 1;
      const n = { x: nx / nLen, y: ny / nLen, z: nz / nLen };

      // Binormal
      const bx = t.y * n.z - t.z * n.y;
      const by = t.z * n.x - t.x * n.z;
      const bz = t.x * n.y - t.y * n.x;
      const b = { x: bx, y: by, z: bz };

      // Circle of points
      for (let j = 0; j < radialSegments; j++) {
        const phi = (j / radialSegments) * Math.PI * 2;
        const cosPhi = Math.cos(phi);
        const sinPhi = Math.sin(phi);

        meshPoints.push({
          x: curr.x + tubeRadius * (cosPhi * n.x + sinPhi * b.x),
          y: curr.y + tubeRadius * (cosPhi * n.y + sinPhi * b.y),
          z: curr.z + tubeRadius * (cosPhi * n.z + sinPhi * b.z)
        });
      }
    }

    // Connect indices to form triangle faces
    interface Face {
      indices: [number, number, number];
      avgZ: number;
    }
    const knotFaces: Face[] = [];

    for (let i = 0; i < tubeSegments; i++) {
      const iCurr = i * radialSegments;
      const iNext = ((i + 1) % tubeSegments) * radialSegments;

      for (let j = 0; j < radialSegments; j++) {
        const jCurr = j;
        const jNext = (j + 1) % radialSegments;

        knotFaces.push({
          indices: [iCurr + jCurr, iNext + jCurr, iNext + jNext],
          avgZ: 0
        });
        knotFaces.push({
          indices: [iCurr + jCurr, iNext + jNext, iCurr + jNext],
          avgZ: 0
        });
      }
    }

    let angleX = 0;
    let angleY = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Lerp mouse variables for continuous fluid inertia
      const m = mouseRef.current;
      m.currentScale += (m.targetScale - m.currentScale) * 0.08;
      m.currentSpinSpeed += (m.targetSpinSpeed - m.currentSpinSpeed) * 0.08;
      m.hoverIntensity += (m.targetHoverIntensity - m.hoverIntensity) * 0.08;
      m.lerpedX += (m.x - m.lerpedX) * 0.08;
      m.lerpedY += (m.y - m.lerpedY) * 0.08;

      // Spawn trail particles upon pointer movement within canvas
      if (m.hover) {
        const dx = m.x - lastTrackedX;
        const dy = m.y - lastTrackedY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 3) {
          const steps = Math.min(5, Math.floor(dist / 6) + 1);
          for (let s = 0; s < steps; s++) {
            const ratio = s / steps;
            const px = lastTrackedX + dx * ratio;
            const py = lastTrackedY + dy * ratio;
            trail.push({
              x: px,
              y: py,
              vx: (Math.random() - 0.5) * 1.6,
              vy: (Math.random() - 0.5) * 1.6 - 0.3, // slight upward drift
              alpha: 1.0,
              size: Math.random() * 2.2 + 1.2
            });
          }
          lastTrackedX = m.x;
          lastTrackedY = m.y;
        }
      } else {
        lastTrackedX = m.x;
        lastTrackedY = m.y;
      }

      // Constrain trail pool size
      if (trail.length > 100) {
        trail.shift();
      }

      // Establish theme colors
      let gridColor = "rgba(0, 0, 0, 0.02)";
      let particleColor = `rgba(0, 0, 0, ${0.12 + m.hoverIntensity * 0.1})`;
      let outlineGridColor = "rgba(0, 0, 0, 0.025)";

      if (theme === "dark") {
        gridColor = "rgba(255, 255, 255, 0.015)";
        particleColor = `rgba(255, 255, 255, ${0.08 + m.hoverIntensity * 0.12})`;
        outlineGridColor = "rgba(255, 255, 255, 0.02)";
      } else if (theme === "green") {
        gridColor = "rgba(34, 197, 94, 0.025)";
        particleColor = `rgba(34, 197, 94, ${0.12 + m.hoverIntensity * 0.18})`;
        outlineGridColor = "rgba(34, 197, 94, 0.04)";
      }

      // Draw subtle responsive grid background
      ctx.strokeStyle = outlineGridColor;
      ctx.lineWidth = 1;
      const stepX = Math.max(20, width / 12);
      for (let x = 0; x < width; x += stepX) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      const stepY = Math.max(20, height / 12);
      for (let y = 0; y < height; y += stepY) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Render interactive micro-grid particles with hover AND trail forces
      particles.forEach(p => {
        let forceX = 0;
        let forceY = 0;
        let sizeBoost = 0;
        let pAlpha = p.alpha;

        let dx = m.lerpedX - p.ox;
        let dy = m.lerpedY - p.oy;
        let dist = Math.sqrt(dx * dx + dy * dy);

        // Core mouse cursor interactive force
        if (dist < 140 && m.hover) {
          const force = (140 - dist) / 140;
          const angle = Math.atan2(dy, dx);
          forceX -= Math.cos(angle) * force * 28 * m.hoverIntensity;
          forceY -= Math.sin(angle) * force * 28 * m.hoverIntensity;
          sizeBoost += force * 1.5 * m.hoverIntensity;
          pAlpha = Math.min(0.85, pAlpha + force * 0.3 * m.hoverIntensity);
        }

        // Active trail interactive force and glow activation
        trail.forEach(tp => {
          let tdx = tp.x - p.ox;
          let tdy = tp.y - p.oy;
          let tdist = Math.sqrt(tdx * tdx + tdy * tdy);
          if (tdist < 65) {
            const tForce = ((65 - tdist) / 65) * tp.alpha;
            const tAngle = Math.atan2(tdy, tdx);
            
            // Subtle magnetic pull towards the trails
            forceX += Math.cos(tAngle) * tForce * 12;
            forceY += Math.sin(tAngle) * tForce * 12;
            sizeBoost += tForce * 1.2;
            pAlpha = Math.min(0.85, pAlpha + tForce * 0.32);
          }
        });

        // Apply visual forces with elegant easing
        const targetX = p.ox + forceX;
        const targetY = p.oy + forceY;
        p.x += (targetX - p.x) * 0.12;
        p.y += (targetY - p.y) * 0.12;

        let currentParticleColor = `rgba(0, 0, 0, ${pAlpha})`;
        if (theme === "dark") {
          currentParticleColor = `rgba(255, 255, 255, ${pAlpha})`;
        } else if (theme === "green") {
          currentParticleColor = `rgba(34, 197, 94, ${pAlpha})`;
        }

        ctx.fillStyle = currentParticleColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 + sizeBoost * 0.5), 0, Math.PI * 2);
        ctx.fill();
      });

      // Update and draw active cursor trail particles (stream ribbon effect)
      for (let i = trail.length - 1; i >= 0; i--) {
        const tp = trail[i];
        
        tp.x += tp.vx;
        tp.y += tp.vy;
        tp.alpha -= 0.02; // Smooth fade-out lifetime
        tp.size = Math.max(0.1, tp.size * 0.98);

        if (tp.alpha <= 0) {
          trail.splice(i, 1);
          continue;
        }

        let tpColor = `rgba(30, 41, 59, ${tp.alpha * 0.55})`;
        if (theme === "dark") {
          tpColor = `rgba(255, 255, 255, ${tp.alpha * 0.6})`;
        } else if (theme === "green") {
          tpColor = `rgba(34, 197, 94, ${tp.alpha * 0.75})`;
        }

        ctx.fillStyle = tpColor;
        ctx.beginPath();
        ctx.arc(tp.x, tp.y, tp.size, 0, Math.PI * 2);
        ctx.fill();

        // Beautiful micro-constellation links
        if (i < trail.length - 1) {
          const nextTp = trail[i + 1];
          const dist = Math.sqrt((tp.x - nextTp.x) ** 2 + (tp.y - nextTp.y) ** 2);
          if (dist < 32) {
            let lineAlpha = tp.alpha * nextTp.alpha * 0.22;
            let strokeColor = `rgba(30, 41, 59, ${lineAlpha})`;
            if (theme === "dark") {
              strokeColor = `rgba(255, 255, 255, ${lineAlpha})`;
            } else if (theme === "green") {
              strokeColor = `rgba(34, 197, 94, ${lineAlpha})`;
            }
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.moveTo(tp.x, tp.y);
            ctx.lineTo(nextTp.x, nextTp.y);
            ctx.stroke();
          }
        }
      }

      // Update rotation angles cleanly
      const baseSpeed = 0.003;
      const hoverSpeedAddition = 0.007 * m.hoverIntensity;
      angleX += baseSpeed + hoverSpeedAddition;
      angleY += (baseSpeed * 1.25) + (hoverSpeedAddition * 1.0);

      // Interactive 3D tilt based on client pointer position
      let targetTiltY = 0;
      let targetTiltX = 0;
      if (m.hover) {
        targetTiltY = ((m.lerpedX - width / 2) / (width / 2)) * 0.65;
        targetTiltX = -((m.lerpedY - height / 2) / (height / 2)) * 0.65;
      }

      const currentAngleX = angleX + targetTiltX;
      const currentAngleY = angleY + targetTiltY;

      // Scale calculations
      const baseScale = Math.min(width, height) * 0.23;
      const scale = baseScale * m.currentScale;
      const cx = width / 2;
      const cy = height / 2;

      // 1. Rotate 3D vertexes
      const rotatedPoints = meshPoints.map(pt => {
        // Y-axis rotation
        let x1 = pt.x * Math.cos(currentAngleY) - pt.z * Math.sin(currentAngleY);
        let z1 = pt.x * Math.sin(currentAngleY) + pt.z * Math.cos(currentAngleY);
        
        // X-axis rotation
        let y2 = pt.y * Math.cos(currentAngleX) - z1 * Math.sin(currentAngleX);
        let z2 = pt.y * Math.sin(currentAngleX) + z1 * Math.cos(currentAngleX);

        return { x: x1, y: y2, z: z2 };
      });

      // 2. Project vertices to 2D
      const projected: Array<{ sx: number; sy: number; sz: number }> = [];
      rotatedPoints.forEach(pt => {
        const depthFactor = 2.8;
        const perspective = depthFactor / (depthFactor + pt.z);
        const sx = cx + pt.x * scale * perspective;
        const sy = cy + pt.y * scale * perspective;
        projected.push({ sx, sy, sz: pt.z });
      });

      // 3. Update depths & Sort faces (back-to-front projection painter algorithm)
      knotFaces.forEach(face => {
        const z0 = projected[face.indices[0]].sz;
        const z1 = projected[face.indices[1]].sz;
        const z2 = projected[face.indices[2]].sz;
        face.avgZ = (z0 + z1 + z2) / 3;
      });

      const sortedFaces = [...knotFaces].sort((a, b) => b.avgZ - a.avgZ);

      // 4. Render faces with Fresnel holographic light intensity
      sortedFaces.forEach(face => {
        const p0 = projected[face.indices[0]];
        const p1 = projected[face.indices[1]];
        const p2 = projected[face.indices[2]];

        // Back-face culling to avoid rendering non-visible faces
        const val = (p1.sx - p0.sx) * (p2.sy - p0.sy) - (p1.sy - p0.sy) * (p2.sx - p0.sx);
        if (val < 0) return;

        // Compute normal vector of the rotated 3D face to calculate lighting
        const r0 = rotatedPoints[face.indices[0]];
        const r1 = rotatedPoints[face.indices[1]];
        const r2 = rotatedPoints[face.indices[2]];

        const ux = r1.x - r0.x;
        const uy = r1.y - r0.y;
        const uz = r1.z - r0.z;
        const vx = r2.x - r0.x;
        const vy = r2.y - r0.y;
        const vz = r2.z - r0.z;

        let nx = uy * vz - uz * vy;
        let ny = uz * vx - ux * vz;
        let nz = ux * vy - uy * vx;
        const nLen = Math.sqrt(nx*nx + ny*ny + nz*nz) || 1;
        nz /= nLen; // Camera looks normal down standard depth

        // Fresnel term representing holographic rim glowing edges
        const fresnel = Math.pow(1.0 - Math.abs(nz), 2.2);

        // Alpha calculation based on depth and interactive pointer values
        const depthAlpha = Math.max(0.06, (1.8 - r0.z) / 2.5);
        const baseAlpha = depthAlpha * (0.12 + m.hoverIntensity * 0.22);
        const glowAlpha = fresnel * (0.35 + m.hoverIntensity * 0.35);
        const totalAlpha = Math.min(0.9, baseAlpha + glowAlpha);

        // Soft, gorgeous mesh lines to give holographic scanner grids
        if (theme === "green") {
          ctx.fillStyle = `rgba(34, 197, 94, ${totalAlpha})`;
          ctx.strokeStyle = `rgba(34, 197, 94, ${totalAlpha * 0.12})`;
        } else if (theme === "dark") {
          ctx.fillStyle = `rgba(255, 255, 255, ${totalAlpha * 0.95})`;
          ctx.strokeStyle = `rgba(255, 255, 255, ${totalAlpha * 0.08})`;
        } else {
          ctx.fillStyle = `rgba(30, 41, 59, ${totalAlpha * 0.9})`;
          ctx.strokeStyle = `rgba(30, 41, 59, ${totalAlpha * 0.06})`;
        }

        ctx.beginPath();
        ctx.moveTo(p0.sx, p0.sy);
        ctx.lineTo(p1.sx, p1.sy);
        ctx.lineTo(p2.sx, p2.sy);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, [theme]); // Only recreate when active theme mode changes

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const m = mouseRef.current;
    
    m.x = e.clientX - rect.left;
    m.y = e.clientY - rect.top;
    m.hover = true;
    m.targetScale = 1.24; // Smoothly scale up on pointer hover
    m.targetSpinSpeed = 2.4; // Spin faster
    m.targetHoverIntensity = 1.0; // Trigger secondary glow states
  };

  const handleMouseLeave = () => {
    const m = mouseRef.current;
    m.hover = false;
    m.targetScale = 1.0; // Return gracefully to normal state
    m.targetSpinSpeed = 1.0;
    m.targetHoverIntensity = 0.0;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="absolute inset-0 w-full h-full pointer-events-auto transition-transform duration-500 ease-out cursor-crosshair"
    >
      <canvas ref={canvasRef} className="block w-full h-full transition-shadow duration-300" />
    </div>
  );
}
