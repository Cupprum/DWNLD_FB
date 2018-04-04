from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
import time
import os


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

time.sleep(8)

webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()

driver.get("https://www.facebook.com/SOMERANDOMPERSON")

time.sleep(8)

webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()

login_form = driver.find_element_by_xpath("//div[contains(.,'Hello Justin')]")

actions = ActionChains(driver)
actions.move_to_element(login_form).perform()

