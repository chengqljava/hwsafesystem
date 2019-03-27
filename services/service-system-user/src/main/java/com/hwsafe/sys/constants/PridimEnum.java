package com.hwsafe.sys.constants;

public enum PridimEnum {
	



    	
        PLACE(0, "区域");
    	
    	 private Integer code;
         private String desc;

         private PridimEnum(Integer code, String desc) {
             this.code = code;
             this.desc = desc;
         }

		public Integer getCode() {
			return code;
		}


		public String getDesc() {
			return desc;
		}

		

        
   
	
}
