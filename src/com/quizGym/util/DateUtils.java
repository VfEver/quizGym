package com.quizGym.util;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * 日期转换格式类
 * @author zys
 *
 */
public class DateUtils {
	
	/**
	 * 将日期转换为指定格式的字符串
	 * @param format
	 * @param date
	 * @return
	 */
	public static String dateToString(String format, Date date) {
		
		SimpleDateFormat sdf = new SimpleDateFormat(format);
		String result = "2016-11-04";
		try {
			result = sdf.format(date);
		} catch(Exception e) {
		}
		return result;
	}
	
}
