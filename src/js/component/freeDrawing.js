/**
 * @author NHN. FE Development Team <dl_javascript@nhn.com>
 * @fileoverview Free drawing module, Set brush
 */
import fabric from 'fabric';
import Component from '@/interface/component';
import { eventNames as events, componentNames } from '@/consts';

/**
 * FreeDrawing
 * @class FreeDrawing
 * @param {Graphics} graphics - Graphics instance
 * @extends {Component}
 * @ignore
 */
class FreeDrawing extends Component {
  constructor(graphics) {
    super(componentNames.FREE_DRAWING, graphics);

    /**
     * Brush width
     * @type {number}
     */
    this.width = 12;

    /**
     * fabric.Color instance for brush color
     * @type {fabric.Color}
     */
    this.oColor = new fabric.Color('rgba(0, 0, 0, 0.5)');

    this._handlers = {
      mousedown: this._onFabricMouseDown.bind(this),
      mousemove: this._onFabricMouseMove.bind(this),
      mouseup: this._onFabricMouseUp.bind(this),
    };
  }

  /**
   * Start free drawing mode
   * @param {{width: ?number, color: ?string}} [setting] - Brush width & color
   */
  start(setting) {
    const canvas = this.getCanvas();

    canvas.isDrawingMode = true;
    this.setBrush(setting);

    canvas.on('mouse:down', this._handlers.mousedown);
  }

  /**
   * Set brush
   * @param {{width: ?number, color: ?string}} [setting] - Brush width & color
   */
  setBrush(setting) {
    const brush = this.getCanvas().freeDrawingBrush;

    setting = setting || {};
    this.width = setting.width || this.width;
    if (setting.color) {
      this.oColor = new fabric.Color(setting.color);
    }
    brush.width = this.width;
    brush.color = this.oColor.toRgba();
  }

  /**
   * End free drawing mode
   */
  end() {
    const canvas = this.getCanvas();

    canvas.isDrawingMode = false;

    canvas.off({
      'mouse:down': this._handlers.mousedown,
    });
  }

  _onFabricMouseDown() {
    const canvas = this.getCanvas();

    canvas.on({
      'mouse:move': this._handlers.mousemove,
      'mouse:up': this._handlers.mouseup,
    });

    this.fire(events.ADD_OBJECT, this.graphics.createObjectProperties());
  }

  _onFabricMouseMove(fEvent) {
    const canvas = this.getCanvas();
    const pointer = canvas.getPointer(fEvent.e);

    this._line.set({
      x2: pointer.x,
      y2: pointer.y,
    });

    this._line.setCoords();

    canvas.renderAll();
  }

  _onFabricMouseUp() {
    const canvas = this.getCanvas();

    this.fire(events.OBJECT_ADDED, this._createLineEventObjectProperties());

    this._line = null;

    canvas.off({
      'mouse:move': this._handlers.mousemove,
      'mouse:up': this._handlers.mouseup,
    });
  }
}

export default FreeDrawing;
