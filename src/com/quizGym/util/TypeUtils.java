package com.quizGym.util;

public class TypeUtils {
	public static int getTypeID(String typeName) {
		switch(typeName) {
		case "sports" : return 1;
		case "science" : return 4;
		case "music" : return 3;
		case "photography": return 2;
		case "film" : return 5;
		}
		return 0;
	}
}
