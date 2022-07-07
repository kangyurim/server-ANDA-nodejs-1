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

#���� ������ ��������
getwd()
setwd('/Users/joonhwi/Desktop/UMC-anda/server-UMC-Anda')
data <- read_excel("hospitalInformationService.xls")
names(data)

#�ʿ��� �÷������� DF������
selectedColumnTable <- subset(data, select=c(�������, �õ��ڵ��, �ñ����ڵ��, ������ȣ, �ּ�, ��ȭ��ȣ, ����URL, x��ǥ, y��ǥ))
head(selectedColumnTable)

#�Ȱ��� ���Ե� ���� ���� ����
OphthalmologyDF <- dplyr::filter(selectedColumnTable, grepl('�Ȱ�', �������))
head(OphthalmologyDF)

write.xlsx(OphthalmologyDF, file="OphthalmologyDATA.xlsx")