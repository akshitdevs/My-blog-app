// hooks/useSwipe.js

import { useRef, useState } from "react";

const SWIPE_THRESHOLD = 60;

function useSwipe(filter, setFilter, filters) {
    const [dragX, setDragX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [indicatorOffset, setIndicatorOffset] = useState(0);

    const touchStartX = useRef(0);
    const touchStartY = useRef(0);
    const touchStartTime = useRef(0);
    const isSwiping = useRef(false);
    const lastVelX = useRef(0);

    // 🔹 Touch start
    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
        touchStartTime.current = Date.now();

        isSwiping.current = false;
        lastVelX.current = 0;

        setIsDragging(true);
        setDragX(0);
        setIndicatorOffset(0);
    };

    // 🔹 Touch move
    const handleTouchMove = (e) => {
        if (!isDragging) return;

        const dx = e.touches[0].clientX - touchStartX.current;
        const dy = e.touches[0].clientY - touchStartY.current;
        const dt = Date.now() - touchStartTime.current;

        // direction lock (avoid vertical scroll conflict)
        if (!isSwiping.current) {
            if (Math.abs(dx) < 6) return;

            if (Math.abs(dx) > Math.abs(dy)) {
                isSwiping.current = true;
            } else {
                setIsDragging(false);
                return;
            }
        }

        if (isSwiping.current) e.preventDefault();

        // velocity (px/ms)
        lastVelX.current = dt > 0 ? dx / dt : 0;

        const currentIndex = filters.indexOf(filter);
        const atStart = currentIndex === 0 && dx > 0;
        const atEnd = currentIndex === filters.length - 1 && dx < 0;

        // edge resistance (rubber-band feel)
        const moveX = (atStart || atEnd) ? dx * 0.25 : dx;

        // indicator movement
        const progress = Math.max(-1, Math.min(1, -dx / window.innerWidth));

        setDragX(moveX);
        setIndicatorOffset(progress);
    };

    // 🔹 Touch end
    const handleTouchEnd = () => {
        if (!isSwiping.current) {
            setDragX(0);
            setIndicatorOffset(0);
            setIsDragging(false);
            return;
        }

        const currentIndex = filters.indexOf(filter);
        const momentumBoost = lastVelX.current * 150;
        const effective = dragX + momentumBoost;

        if (effective < -SWIPE_THRESHOLD && currentIndex < filters.length - 1) {
            setFilter(filters[currentIndex + 1]);
        } else if (effective > SWIPE_THRESHOLD && currentIndex > 0) {
            setFilter(filters[currentIndex - 1]);
        }

        setDragX(0);
        setIndicatorOffset(0);
        setIsDragging(false);
    };

    return {
        dragX,
        isDragging,
        indicatorOffset,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
    };
}

export default useSwipe;