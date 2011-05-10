/* ServletLabelLocator.java

	Purpose:
		
	Description:
		
	History:
		Sat Apr  8 19:51:08     2006, Created by tomyeh

Copyright (C) 2006 Potix Corporation. All Rights Reserved.

{{IS_RIGHT
	This program is distributed under LGPL Version 3.0 in the hope that
	it will be useful, but WITHOUT ANY WARRANTY.
}}IS_RIGHT
*/
package org.zkoss.web.util.resource;

import java.util.Locale;
import java.io.IOException;
import java.net.URL;
import javax.servlet.ServletContext;

import org.zkoss.lang.Library;
import org.zkoss.lang.Objects;
import org.zkoss.util.resource.LabelLocator;
import org.zkoss.util.logging.Log;
import org.zkoss.web.servlet.Servlets;

/**
 * Used by Lables to load labels from a servlet context.
 *
 * @author tomyeh
 */
public class ServletLabelLocator implements LabelLocator {
	private static final Log log = Log.lookup(ServletLabelLocator.class);

	private final ServletContext _ctx;
	private final String _path;

	/** Constructs a locator where the properties file is decided
	 * by the library property called org.zkoss.util.label.web.location.
	 * If not defined, /WEB-INF/i3-label.properties is assumed
	 */
	public ServletLabelLocator(ServletContext ctx) {
		this(ctx, null);
	}
	/** Constructs a locator for the given path.
	 * @param path the path of the properties file<br/>
	 * Notice that <code>file://path</code> is supported (but not http://).
	 * @since 5.0.7
	 */
	public ServletLabelLocator(ServletContext ctx, String path) {
		if (ctx == null)
			throw new IllegalArgumentException("null");
		_ctx = ctx;
		_path = path;
	}

	//-- LabelLocator --//
	public URL locate(Locale locale) throws IOException {
		String path = _path != null ? _path:
			Library.getProperty("org.zkoss.util.label.web.location", 
				"/WEB-INF/i3-label.properties");
		final int j = path.lastIndexOf('.');
		final String prefix = j >= 0 ? path.substring(0, j): path;
		final String suffix = j >= 0 ? path.substring(j): "";
		path = locale == null ? prefix + suffix: prefix + '_' + locale + suffix;
		final URL url = path.toLowerCase().startsWith("file://") ?
			Servlets.getResource(_ctx, path): _ctx.getResource(path);
			//we don't accept http:// since we cannot detect if it exists
		if (url == null && _path != null && _path.equals(path))
			log.error("File not found: " + path);
		return url;
	}

	//-- Object --//
	public int hashCode() {
		return _ctx.hashCode() + Objects.hashCode(_path);
	}
	public boolean equals(Object o) {
		return o instanceof ServletLabelLocator
			&& ((ServletLabelLocator)o)._ctx.equals(_ctx)
			&& Objects.equals(((ServletLabelLocator)o)._path, _path);
	}
	public String toString() {
		return "ServletLabelLocator" + (_path != null ? ": " + _path: "");
	}
}
