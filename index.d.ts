export = imageDiff;
/**
 * Compares two images, creates diff img and returns differences as SSIM stats.
 *
 * @param {string} refImg File path to reference image
 * @param {string} cmpImg File path to comparison image
 * @param {string} [outImg] File path to output image
 * @param {Options} [options] Image diffing options
 * @returns {Promise<Result>} Resolves with the image comparison result
 */
declare function imageDiff(refImg: string, cmpImg: string, outImg?: string, options?: Options): Promise<Result>;
declare namespace imageDiff {
    export { Options, Result };
}
/**
 * Image diffing options
 */
type Options = {
    /**
     * Set to `false` to disable SSIM calculation
     */
    ssim?: boolean;
    /**
     * Threshold to identify image differences
     */
    similarity?: number;
    /**
     * Blend percentage for the differential pixels
     */
    blend?: number;
    /**
     * Opacity of the reference image as backdrop
     */
    opacity?: number;
    /**
     * Color balance of the differential pixels
     */
    color?: string;
};
type Result = {
    /**
     * Red color differences
     */
    R?: number;
    /**
     * Green color differences
     */
    G?: number;
    /**
     * blue color differences
     */
    B?: number;
    /**
     * All color differences
     */
    All?: number;
};
