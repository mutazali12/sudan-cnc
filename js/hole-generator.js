/**
 * توليد الثقوب باستخدام شبكة (Grid) مع قناع داخلي (Inset Mask)
 * لضمان عدم تجاوز المسافة المحددة عن حافة الحرف.
 */
export function generateHoles(maskCanvas, insetMaskCanvas, step, edgePx, scale) {
    const holes = [];
    const width = maskCanvas.width;
    const height = maskCanvas.height;
    const insetWidth = insetMaskCanvas.width;
    const insetHeight = insetMaskCanvas.height;

    const insetCtx = insetMaskCanvas.getContext('2d');
    const insetData = insetCtx.getImageData(0, 0, insetWidth, insetHeight).data;

    // فحص سريع: هل البكسل في القناع الداخلي؟
    const isInsideInset = (ix, iy) => {
        if (ix < 0 || ix >= insetWidth || iy < 0 || iy >= insetHeight) return false;
        const idx = (iy * insetWidth + ix) * 4;
        return insetData[idx + 3] > 128; // Alpha > 128 يعني جزء من النص
    };

    // تمشيط الشبكة
    for (let x = step; x < width; x += step) {
        for (let y = step; y < height; y += step) {
            // التحويل إلى إحداثيات القناع الداخلي
            const ix = x - edgePx;
            const iy = y - edgePx;
            if (isInsideInset(ix, iy)) {
                holes.push({
                    x: x / scale,   // سم
                    y: y / scale,
                    cx: x,         // بكسل للرسم
                    cy: y
                });
            }
        }
    }
    return holes;
}
