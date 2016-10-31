package com.quizGym.util;

public class TypeUtils {
	public static int getTypeID(String typeName) {
		switch(typeName) {
		case "sports" : return 1;
		case "science" : return 4;
		case "music" : return 3;
		case "photography": return 2;
		case "film" : return 5;
		default : return 0;
		}
	}
	
	public static String getTypeName(int id) {
		switch(id) {
		case 1 : return "sports";
		case 2 : return "photography";
		case 3 : return "music";
		case 4 : return "science";
		case 5 : return "film";
		default : return "none";
		}
	}
}
