package org.zkoss.zktest.zats.test2;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

import org.zkoss.zktest.zats.WebDriverTestCase;

/**
 * @author jameschu
 */
public class B70_ZK_2825Test extends WebDriverTestCase {
	@Test
	public void test() {
		connect();
		assertEquals("0\n1\n2\n", jq("$lbl").text());
	}
}
