#install.packages("readxl")
#install.packages("writexl")
#install.packages("dplyr")
#install.packages("xlsx")
#install.packages("openxlsx")

library("openxlsx")
library(writexl)
library(xlsx)
library(dplyr)
library(readxl)
library(xlsx)

#원본 데이터 가져오기
getwd()
setwd('/Users/joonhwi/Desktop/UMC-anda/server-UMC-Anda')
data <- read_excel("hospitalInformationService.xls")
names(data)

#필요한 컬럼만으로 DF재정의
selectedColumnTable <- subset(data, select=c(요양기관명, 시도코드명, 시군구코드명, 우편번호, 주소, 전화번호, 병원URL, x좌표, y좌표))
head(selectedColumnTable)

#안과가 포함된 병원 명만 추출
OphthalmologyDF <- dplyr::filter(selectedColumnTable, grepl('안과', 요양기관명))
head(OphthalmologyDF)

write.xlsx(OphthalmologyDF, file="OphthalmologyDATA.xlsx")
