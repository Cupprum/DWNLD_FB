from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
import time
import os
import re


driver = webdriver.Firefox()
driver.get("https://www.facebook.com")

my_fb_mail = os.environ["FB_MAIL"]
my_fb_pass = os.environ["FB_PASS"]

mail = driver.find_element_by_name("email")
mail.clear()
mail.send_keys(my_fb_mail)

password = driver.find_element_by_name("pass")
password.clear()
password.send_keys(my_fb_pass)
password.send_keys(Keys.RETURN)

time.sleep(5)

webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()

driver.get("https://www.facebook.com/b.tallova")

time.sleep(2)

webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()

SCROLL_PAUSE_TIME = 5

last_height = driver.execute_script("return document.body.scrollHeight")

while True:
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

    driver.execute_script(open("./fetcher.js").read())

    time.sleep(SCROLL_PAUSE_TIME)

    new_height = driver.execute_script("return document.body.scrollHeight")
    if new_height == last_height:
        break
    last_height = new_height

time.sleep(10)

obsah = str(driver.page_source)

txt = open("final_html.html", "w")

for x in obsah:
    txt.write(x)
