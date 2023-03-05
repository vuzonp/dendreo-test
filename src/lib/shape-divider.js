/**
 * Draws the path of the svg used to separate the tables.
 */
export class ShapeDivider {
  /** The parent element */
  #svgElement;

  /** The path element contained in SVG */
  #pathElement;

  /** Positions of 1st point to the "funnel" shape */
  #pointA = [0, 0];

  /** Positions of 2nd point to the "funnel" shape */
  #pointB = [100, 45];

  /** Positions of 3rd point to the "funnel" shape */
  #pointC = [100, 55];

  /** Positions of 4th point to the "funnel" shape */
  #pointD = [0, 100];

  /** Width of the SVG */
  #width = 100;

  /** Height of the SVG */
  #height = 100;

  /**
   * @param {SVGElement} svgElement
   */
  constructor(svgElement) {
    this.#svgElement = svgElement;
    this.#pathElement = svgElement.querySelector("path");
  }

  /** Positions of 1st curve to the "funnel" shape */
  get #curveA() {
    const x = this.#width / 4;
    const y = this.#pointA[1];
    return [x, y];
  }

  /** Positions of 2nd curve to the "funnel" shape */
  get #curveB() {
    const x = (this.#width / 4) * 3;
    const y = this.#pointB[1];
    return [x, y];
  }

  /** Positions of 3rd curve to the "funnel" shape */
  get #curveC() {
    const x = (this.#width / 4) * 3;
    const y = this.#pointC[1];
    return [x, y];
  }

  /** Positions of 4th curve to the "funnel" shape */
  get #curveD() {
    const x = this.#width / 4;
    const y = this.#pointD[1];
    return [x, y];
  }

  /** Generates the path of the shape in using the points values. */
  #getPath() {
    return `M ${this.#pointA[0]} ${this.#pointA[1]} C ${this.#curveA[0]} ${
      this.#curveA[1]
    } ${this.#curveB[0]} ${this.#curveB[1]} ${this.#pointB[0]} ${
      this.#pointB[1]
    } L ${this.#pointC[0]} ${this.#pointC[1]} C ${this.#curveC[0]} ${
      this.#curveC[1]
    } ${this.#curveD[0]} ${this.#curveD[1]} ${this.#pointD[0]} ${
      this.#pointD[1]
    } Z`;
  }

  /** Defines a set of positions to use for drawing the shape.
   * @param {number} bY The top point to target.
   * @param {number} cY The bottom point to target.
   * @param {number} height The maximum size of the funnel.
   */
  setDynamicPositions(bY, cY, height) {
    const pointA = [0, 0];
    const pointB = [this.#width, bY];
    const pointC = [this.#width, cY];
    const pointD = [0, height];
    this.setPositions(pointA, pointB, pointC, pointD);
  }

  /**
   * Defines each points to use for drawing the shape.
   * (please privilege `setDynamicPositions`).
   * @param {[number, number]} pointA x and y coordinates of the top left point.
   * @param {[number, number]} pointB x and y coordinates of the top right point.
   * @param {[number, number]} pointC x and y coordinates of the bottom right point.
   * @param {[number, number]} pointD x and y coordinates of the bottom left point.
   */
  setPositions(pointA, pointB, pointC, pointD) {
    this.#pointA = pointA;
    this.#pointB = pointB;
    this.#pointC = pointC;
    this.#pointD = pointD;
  }

  /**
   * Refreshes and displays the svg.
   */
  draw() {
    this.#width = this.#svgElement.clientWidth;
    this.#height = this.#svgElement.clientHeight;
    this.setDynamicPositions(this.#pointB[1], this.#pointC[1], this.#pointD[1]);
    this.#svgElement.setAttribute(
      "viewBox",
      `0 0 ${this.#width} ${this.#height}`
    );
    this.#pathElement.setAttribute("d", this.#getPath());
    this.#pathElement.classList.remove("hidden");
  }

  /**
   * In case the funnel should point to the left, applies a mirror effect.
   */
  flipToRight() {
    this.#pathElement.setAttribute(
      "transform",
      `translate(${this.#width}, 0) scale(-1, 1)`
    );
  }

  /**
   * In case the funnel should point to the right, resets the mirror effect.
   */
  flipToLeft() {
    this.#pathElement.removeAttribute("transform");
  }
}
