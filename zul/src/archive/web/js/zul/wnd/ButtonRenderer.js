/** @class zul.wnd.ButtonRenderer
 * The renderer used to render buttons of a window.
 * It is designed to be overridden
 * @since 9.1.0
 */
zul.wnd.ButtonRenderer = {
	/** Redraws the collapse button HTML.
	 *
	 * @param zul.wnd.Panel wgt the panel
	 * @param zk.Buffer out the buffer
	 * @param int the tabindex, can be omitted
	 */
	redrawCollapseButton: function (wgt, out, tabindex) {
		var uuid = wgt.uuid,
			icon = wgt.$s('icon'),
			isOpen = wgt._open,
			openIcon = isOpen ? wgt.getCollapseOpenIconClass_() : wgt.getCollapseCloseIconClass_(),
			collapsibleLabel = isOpen ? msgzul.PANEL_COLLAPSE : msgzul.PANEL_EXPAND;
		out.push('<button id="', uuid , '-exp" class="', icon, ' ', wgt.$s('expand'), '"');
		if (tabindex != undefined) out.push(' tabindex="', tabindex, '"');
		out.push(' title="', collapsibleLabel, '" aria-label="', collapsibleLabel, '">');
		out.push('<i class="', openIcon, '" aria-hidden="true"></i></button>');
	},
	/** Redraws the minimize button HTML.
	 *
	 * @param zul.wnd.Window wgt the window
	 * @param zk.Buffer out the buffer
	 * @param int the tabindex, can be omitted
	 */
	redrawMinimizeButton: function (wgt, out, tabindex) {
		var uuid = wgt.uuid,
			icon = wgt.$s('icon'),
			minLabel = msgzul.PANEL_MINIMIZE;
		out.push('<button id="', uuid , '-min" class="', icon, ' ', wgt.$s('minimize'), '"');
		if (tabindex != undefined) out.push(' tabindex="', tabindex, '"');
		out.push(' title="', minLabel, '" aria-label="', minLabel ,'">');
		out.push('<i class="', wgt.getMinimizableIconClass_(), '" aria-hidden="true"></i></button>');
	},
	/** Redraws the maximize button HTML.
	 *
	 * @param zul.wnd.Window wgt the window
	 * @param zk.Buffer out the buffer
	 * @param int the tabindex, can be omitted
	 */
	redrawMaximizeButton: function (wgt, out, tabindex) {
		var uuid = wgt.uuid,
			icon = wgt.$s('icon'),
			maxd = wgt._maximized,
			maxLabel = msgzul.PANEL_MAXIMIZE;
		out.push('<button id="', uuid , '-max" class="', icon, ' ', wgt.$s('maximize'));
		if (maxd) out.push(' ', wgt.$s('maximized'));
		var maxIcon = maxd ? wgt.getMaximizedIconClass_() : wgt.getMaximizableIconClass_();
		if (tabindex != undefined) out.push('" tabindex="', tabindex);
		out.push('" title="', maxLabel, '" aria-label="', maxLabel, '">');
		out.push('<i class="', maxIcon, '" aria-hidden="true"></i></button>');
	},
	/** Redraws the close button HTML.
	 *
	 * @param zul.wnd.Window wgt the window
	 * @param zk.Buffer out the buffer
	 * @param int the tabindex, can be omitted
	 */
	redrawCloseButton: function (wgt, out, tabindex) {
		var uuid = wgt.uuid,
			icon = wgt.$s('icon'),
			closeLabel = msgzul.PANEL_CLOSE;
		out.push('<button id="', uuid , '-close" class="', icon, ' ', wgt.$s('close'), '"');
		if (tabindex != undefined) out.push(' tabindex="', tabindex, '"');
		out.push(' title="', closeLabel, '" aria-label="', closeLabel, '">');
		out.push('<i class="', wgt.getClosableIconClass_(), '" aria-hidden="true"></i></button>');
	}
};