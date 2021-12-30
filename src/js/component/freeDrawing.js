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
    this.fire(events.ADD_OBJECT, this.graphics.createObjectProperties());
  }
}

export default FreeDrawing;
