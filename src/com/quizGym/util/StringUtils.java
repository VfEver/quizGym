package com.quizGym.util;
/**
 * 字符串工具类
 * @author zys
 *
 */
public class StringUtils {
	/**
	 * 判断字符串是否为空
	 * @param string
	 * @return
	 */
	public static boolean isNull(String string) {
		return string == null || "".equals(string);
	}
}
