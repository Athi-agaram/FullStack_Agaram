package com.example.demo.global;

public class Global {
	public String FormatSQLText(String SQLText) {
		String Formatvalue=SQLText;
		if(SQLText!=null && SQLText!="" &&
				SQLText.getClass().getSimpleName().equals("String"))
			Formatvalue=SQLText.replace("'","''");
		
		return Formatvalue;
	}
}
