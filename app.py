from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
import time
import os


driver = webdriver.Firefox()
driver.get("https://www.facebook.com/")

my_fb_mail = os.environ["FB_MAIL"]
my_fb_pass = os.environ["FB_PASS"]

mail = driver.find_element_by_name("email")
mail.clear()
mail.send_keys(my_fb_mail)

password = driver.find_element_by_name("pass")
password.clear()
password.send_keys(my_fb_pass)
password.send_keys(Keys.RETURN)

time.sleep(60)

txt = open("www.html", "w")
html_source = driver.page_source
txt.write(html_source)
