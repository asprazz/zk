/* zul.js

{{IS_NOTE
	Purpose:
		Common utilities for zul.
	Description:
		
	History:
		Thu Jul 14 15:02:27     2005, Created by tomyeh
}}IS_NOTE

Copyright (C) 2005 Potix Corporation. All Rights Reserved.

{{IS_RIGHT
	This program is distributed under GPL Version 2.0 in the hope that
	it will be useful, but WITHOUT ANY WARRANTY.
}}IS_RIGHT
*/
zk.load("zul.lang.msgzul*");

////
zul = {};
zul._movs = {}; //(id, Draggable): movables

/////////
// Movable
/** Make a component movable (by moving). */
zul.initMovable = function (cmp, options) {
	zul._movs[cmp.id] = new Draggable(cmp, options);
};
/** Undo movable for a component. */
zul.cleanMovable = function (id) {
	if (zul._movs[id]) {
		zul._movs[id].destroy();
		delete zul._movs[id];
	}
};
zul.getMetaByHeader = function (cmp) {
	return zkau.getMeta(getZKAttr(cmp.parentNode, "rid"));
};
zul.adjustHeadWidth = function (hdfaker, bdfaker, ftfaker, rows) {
	if (hdfaker == null || bdfaker == null || !hdfaker.cells.length
	|| !bdfaker.cells.length || !zk.isRealVisible(hdfaker) || !rows || !rows.length) return;
	
	var hdtable = hdfaker.parentNode.parentNode, head = zul.getRealHeader(hdtable.tBodies[1].rows);
	if (!head) return; 
	if (zk.opera && !hdtable.style.width)
		hdtable.style.tableLayout = "auto";
	var including = zk.revisedSize(head.cells[0], 100) !== zk.revisedSize(hdfaker.cells[0], 100);
	
	// Bug #1886788 the size of these table must be specified a fixed size.
	var total = 0;
	for (var k = head.cells.length; --k >= 0;)
		total += head.cells[k].offsetWidth;
	
	hdtable.style.width = total + "px";	
	var bdtable = $parentByTag(bdfaker, "TABLE");
	if (bdtable) bdtable.style.width = hdtable.style.width;
	var fttable = $parentByTag(ftfaker, "TABLE");
	if (fttable) bdtable.style.width = hdtable.style.width;
	
	for (var i = bdfaker.cells.length; --i >= 0;) {
		if (!zk.isVisible(hdfaker.cells[i])) continue;
		
		bdfaker.cells[i].style.width = zk.revisedSize(bdfaker.cells[i], bdfaker.cells[i].offsetWidth) + "px";
		hdfaker.cells[i].style.width = bdfaker.cells[i].style.width;
		if (ftfaker) ftfaker.cells[i].style.width = bdfaker.cells[i].style.width;
		var cpwd = including ? zk.revisedSize(head.cells[i], $int(hdfaker.cells[i].style.width)) :
			$int(hdfaker.cells[i].style.width);
		head.cells[i].style.width = cpwd + "px";
		var cell = head.cells[i].firstChild;
		cell.style.width = zk.revisedSize(cell, cpwd) + "px";
	}
	
	// in some case, the total width of this table may be changed.
	var total1 = 0;
	for (var k = head.cells.length; --k >= 0;)
		total1 += head.cells[k].offsetWidth;
	if (total != total1) {
		hdtable.style.width = total1 + "px";	
		if (bdtable) bdtable.style.width = hdtable.style.width;
		if (fttable) bdtable.style.width = hdtable.style.width;
	}
};
zul.getRealHeader = function (rows) {
	for(var j =0, rl = rows.length; j < rl; j++) {
		var type = $type(rows[j]);
		if (type == "Cols" || type == "Lhrs" || type == "Tcols") {
			return rows[j];
		}
	}
	return null;
};
/////////
// Headers
//For sortable header, e.g., Column and Listheader (TH or TD is assumed)
zulHdrs = {};
zulHdrs.setAttr = function (cmp, nm, val) {
	zkau.setAttr(cmp, nm, val);

	if (nm == "z.sizable") {
		var cells = cmp.cells;
		if (cells) {
			var sizable = val == "true";
			for (var j = cells.length; --j >= 0;)
				zulHdr.setSizable(cells[j], sizable);
		}
	}
	return true;
};
zulHdrs.ondragover = function (evt) {
	var target = Event.element(evt);
	var tag = $tag(target);
	if (tag != "INPUT" && tag != "TEXTAREA") {
		var el = target;
		for (; el; el = $parent(el)) {
		var type = $type(el);
		if (type == "Lhr" || type == "Col" || type == "Tcol" || type == "Ftr")
			break;
		}
		if (el) el.firstChild.style.MozUserSelect = "none";
	}
};
zulHdrs.ondragout = function (evt) {
	var target = Event.element(evt);
	var el = target;
	for (; el; el = $parent(el)) {
		var type = $type(el);
		if (type == "Lhr" || type == "Col" || type == "Tcol" || type == "Ftr")
			break;
	}
	if (el) el.firstChild.style.MozUserSelect = "";
};
zulHdrs.initdrag = function (cmp) {
	if (zk.gecko) {
		zk.listen(cmp, "mouseover", zulHdrs.ondragover);
		zk.listen(cmp, "mouseout",  zulHdrs.ondragout);	
	}
};
zulHdrs.cleandrag = function (cmp) {
	if (zk.gecko) {
		zk.unlisten(cmp, "mouseover", zulHdrs.ondragover);
		zk.unlisten(cmp, "mouseout",  zulHdrs.ondragout);	
	}
};
zulHdrs.cleanup = function (cmp) {
	var hdfaker = $e(cmp.id + "!hdfaker"), bdfaker = $e(cmp.id + "!bdfaker"),
		ftfaker = $e(cmp.id + "!ftfaker");
	if (hdfaker) zk.remove(hdfaker);
	if (bdfaker) zk.remove(bdfaker);
	if (ftfaker) zk.remove(ftfaker);
};
zulHdr = {}; //listheader
zulHdr._szs = {};
zulHdr.initdrag = zulHdrs.initdrag;
zulHdr.cleandrag = zulHdrs.cleandrag;
zulHdr.init = function (cmp) {
	zulHdr._show(cmp);
	zk.listen(cmp, "click", function (evt) {zulHdr.onclick(evt, cmp);});
	zk.listen(cmp, "mousemove", function (evt) {if (window.zulHdr) zulHdr.onmove(evt, cmp);});
		//FF: at the moment of browsing to other URL, listen is still attached but
		//our js are unloaded. It causes JavaScript error though harmlessly
		//This is a dirty fix (since onclick and others still fail but hardly happen)

	zulHdr.setSizable(cmp, zulHdr.sizable(cmp));
		//Note: IE6 failed to crop a column if it is draggable
		//Thus we init only necessary (to avoid the IE6 bug)
};
zulHdr.sizable = function (cmp) {
	return cmp.parentNode && getZKAttr(cmp.parentNode, "sizable") == "true";
};
zulHdr.setSizable = function (cmp, sizable) {
	var id = cmp.id;
	if (sizable) {
		if (!zulHdr._szs[id]) {
			var snap = function (x, y) {return zulHdr._snap(cmp, x, y);};
			zulHdr._szs[id] = new Draggable(cmp, {
				starteffect: zk.voidf,
				endeffect: zulHdr._endsizing, ghosting: zulHdr._ghostsizing,
				revert: true, ignoredrag: zulHdr._ignoresizing, snap: snap,
				constraint: "horizontal"
			});
		}
	} else {
		if (zulHdr._szs[id]) {
			zulHdr._szs[id].destroy();
			delete zulHdr._szs[id];
		}
	}
};
/** Resize all rows. (Utilities used by derived).
 * @param meta the metainfo of the parent, such as listbox and grid
 */
zulHdr.resizeAll = function (meta, cmp, icol, col, wd, keys) {
	if(getZKAttr(meta.element, "fixed") != "true") 
		zul.adjustHeadWidth(meta.hdfaker, meta.bdfaker, meta.ftfaker, meta.bodyrows);
	zkau.send({uuid: meta.id, cmd: "onInnerWidth",
			data: [meta.headtbl.style.width]}, -1);
	zkau.send({uuid: cmp.id, cmd: "onColSize",
		data: [icol, col.id, (wd+"px"), keys]}, zkau.asapTimeout(cmp, "onColSize"));
	meta._render(zk.gecko ? 200: 60); // just in case.
};
zulHdr.cleanup = function (cmp) {
	zulHdr.setSizable(cmp, false);
	var hdfaker = $e(cmp.id + "!hdfaker"), bdfaker = $e(cmp.id + "!bdfaker"),
		ftfaker = $e(cmp.id + "!ftfaker");
	if (hdfaker) zk.remove(hdfaker);
	if (bdfaker) zk.remove(bdfaker);
	if (ftfaker) zk.remove(ftfaker);
};
zulHdr.setAttr = function (cmp, nm, val) {
	switch(nm) { // Bug #1822566 
		case "style.width" :			
		case "style.height" :		
		case "style" :			
			
			var cell = cmp.firstChild;
			var v = val, meta = zul.getMetaByHeader(cmp);	
			if (nm == "style") v = zk.getTextStyle(val, true, true);
			if (v) {
				if (nm == "style.width") {
					if (v && v != "auto" && v.indexOf('%') < 0) {
						var including = zk.revisedSize(meta.headrows[0].cells[0], 100) !== zk.revisedSize(meta.hdfaker.cells[0], 100);
						v = (including ? zk.revisedSize(cmp, $int(v)) : v);
						v = zk.revisedSize(cell, $int(v)) + "px";
						zkau.setAttr(cell, nm, v);
					} else {
						zkau.setAttr(cell, nm, "100%");
					}
				} else {
					zkau.setAttr(cell, nm, v);
				}
			}
			zkau.setAttr(cmp, nm, val);
			
			if (nm == "style.width") {
				var hdfaker = $e(cmp.id + "!hdfaker"), bdfaker = $e(cmp.id + "!bdfaker"),
					ftfaker = $e(cmp.id + "!ftfaker");
				if (hdfaker)
					hdfaker.style.width = val;
				if (bdfaker)
					bdfaker.style.width = val;
				if (ftfaker)
					ftfaker.style.width = val;
					 
				if (meta) meta._recalcSize();
			}
			return true;
	}
	zkau.setAttr(cmp, nm, val);
	if (nm == "z.sort") zulHdr._show(cmp);
	return true;
};

zulHdr.onclick = function (evt, cmp) {
	if (!zk.dragging && $uuid(Event.element(evt)) == cmp.id && zulHdr._sortable(cmp) 
		&& zkau.insamepos(evt) && $tag(Event.element(evt)) != "INPUT")
		zkau.send({uuid: cmp.id, cmd: "onSort", data: null}, 10);
};
zulHdr.onmove = function (evt, cmp) {
	if (zk.dragging) return;
	var ofs = zk.revisedOffset(cmp); // Bug #1812154
	var v = zulHdr._insizer(cmp, Event.pointerX(evt) - ofs[0]);
	if (v) {
		zk.backupStyle(cmp, "cursor");
		cmp.style.cursor = v == 1 ? "e-resize": "w-resize";
	} else {
		zk.restoreStyle(cmp, "cursor");
	}
};
/** Called by zkau._ignoredrag (in au.js) for generic drag&drop. */
zulHdr.ignoredrag = function (cmp, pointer) {
	var ofs = zk.revisedOffset(cmp); // Bug #1812154
	return zulHdr._insizer(cmp, pointer[0] - ofs[0]);
};
/** Returns 1 if right, -1 if left, 0 if none. */
zulHdr._insizer = function (cmp, x) {
	if (zulHdr.sizable(cmp)) {
		if (x >= cmp.offsetWidth - 10) return 1;		
	}
	return 0;
};
/** Called by zulHdr._szs[]'s ignoredrag for resizing column. */
zulHdr._ignoresizing = function (cmp, pointer) {
	var dg = zulHdr._szs[cmp.id];
	if (dg) {
		var ofs = zk.revisedOffset(cmp); // Bug #1812154
		var v = zulHdr._insizer(cmp, pointer[0] - ofs[0]);
		if (v) {
			dg.z_min = 10 + zk.sumStyles(cmp, "lr", zk.borders) + zk.sumStyles(cmp, "lr", zk.paddings);		
			return false;
		}
	}
	return true;
};
zulHdr._endsizing = function (cmp, evt) {
	var dg = zulHdr._szs[cmp.id];
	if (dg && dg.z_szofs) {
		var meta = zul.getMetaByHeader(cmp);
		var keys = "", wd = dg.z_szofs, table = $parentByTag(cmp, "TABLE"), head = table.tBodies[0].rows[0],
			including = zk.revisedSize(head.cells[0], 100) !== zk.revisedSize(table.tBodies[1].rows[0].cells[0], 100), 
			rwd = including ? zk.revisedSize(cmp, wd) : wd,
			cells = head.cells, cidx = zk.cellIndex(cmp), total = 0;
		for (var k = cells.length; --k >= 0;)
			if (k !== cidx) total += cells[k].offsetWidth;

		// For Opera, the code of adjusting width must be in front of the adjusting table.
		// Otherwise, the whole layout in Opera always shows wrong.
		if (meta.foottbl) {
			meta.ftfaker.cells[cidx].style.width = wd + "px";
		}
		if (meta.bodytbl) {
			meta.bdfaker.cells[cidx].style.width = wd + "px";
		}
		
		head.cells[cidx].style.width = wd + "px";
		cmp.style.width = rwd + "px";
		var cell = cmp.firstChild;
		cell.style.width = zk.revisedSize(cell, rwd) + "px";
		
		table.style.width = total + wd + "px";		
		if (meta.foottbl) {
			meta.foottbl.style.width = table.style.width;	
		}
		if (meta.bodytbl) {
			meta.bodytbl.style.width = table.style.width;	
		}
		if (evt) {
			if (evt.altKey) keys += 'a';
			if (evt.ctrlKey) keys += 'c';
			if (evt.shiftKey) keys += 's';
		}
		setTimeout("zk.eval($e('"+cmp.id+"'),'resize',null,"+cidx+",'"+wd+"','"+keys+"')", 0);
	}
};
/* @param ghosting whether to create or remove the ghosting
 */
zulHdr._ghostsizing = function (dg, ghosting, pointer) {
	if (ghosting) {
		var el = dg.element.parentNode.parentNode.parentNode;
		var of = zk.revisedOffset(el);
		var ofs = zkau.beginGhostToDIV(dg);
		ofs[1] = of[1];
		ofs[0] += zk.offsetWidth(dg.element);
		document.body.insertAdjacentHTML("afterbegin",
			'<div id="zk_ddghost" style="position:absolute;top:'
			+ofs[1]+'px;left:'+ofs[0]+'px;width:3px;height:'+zk.offsetHeight(el.parentNode.parentNode)
			+'px;background:darkgray"><img src="'+zk.getUpdateURI('/web/img/spacer.gif')
					+'"/></div>');
		dg.element = $e("zk_ddghost");
	} else {
		var org = zkau.getGhostOrgin(dg);
		if (org) {
			var ofs1 = zk.revisedOffset(dg.element);
			var ofs2 = zk.revisedOffset(org);
			dg.z_szofs = ofs1[0] - ofs2[0];
		} else {
			dg.z_szofs = 0;
		}
		zkau.endGhostToDIV(dg);
	}
};
zulHdr._snap = function (cmp, x, y) {
	var dg = zulHdr._szs[cmp.id];
	if (dg) {
		var ofs = zk.revisedOffset(cmp);
		x += zk.offsetWidth(cmp); 
		if (ofs[0] + dg.z_min >= x)
			x = ofs[0] + dg.z_min;
	}
	return [x, y];
};
/** Tests whether it is sortable.
 */
zulHdr._sortable = function (cmp) {
	return getZKAttr(cmp, "asc") || getZKAttr(cmp, "dsc");
};
/** Shows the hint, ascending or descending image.
 */
zulHdr._show = function (cmp) {
	switch (getZKAttr(cmp, "sort")) {
	case "ascending": zulHdr._renCls(cmp, "asc"); break;
	case "descending": zulHdr._renCls(cmp, "dsc"); break;
	case "natural": zulHdr._renCls(cmp); break;
	}
};
zulHdr._renCls = function (cmp, ext) {
	var clsnm = cmp.className || "";
	if (clsnm.endsWith("-asc") || clsnm.endsWith("-dsc"))
		clsnm = clsnm.substring(0, clsnm.length - 4);
	if (ext) clsnm += '-' + ext;
	if (clsnm != cmp.className) cmp.className = clsnm;
};
zkFtr = {};
zkFtr.initdrag = zulHdrs.initdrag;
zkFtr.cleandrag = zulHdrs.cleandrag;
zkFtrs = {};
zkFtrs.initdrag = zulHdrs.initdrag;
zkFtrs.cleandrag = zulHdrs.cleandrag;