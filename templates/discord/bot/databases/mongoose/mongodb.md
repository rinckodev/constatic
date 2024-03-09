# Guide

- [Guide in potuguese](https://discord.com/channels/537817462272557057/1215229094107545681)

# Creating a MongoDb Database

Visit https://www.mongodb.com/pt-br and log in (or register).

<img src="https://media.discordapp.net/attachments/1215229094107545681/1215230167484596265/1.png?ex=65fbfe49&is=65e98949&hm=d32fbea39a01cd1efb5688ee0dd114256ae38721e813f99c090fc3dde4a7e517&=&format=webp&quality=lossless&width=871&height=468" alt="mongodb-setp-01" width="500" height="auto">

You should be sent to the home page. If not, click the Atlas logo at the top of the page
After that, click on **New Project** to create a new project

<img src="https://media.discordapp.net/attachments/1215229094107545681/1215232236459393054/2.png?ex=65fc0037&is=65e98b37&hm=4c74e90177345832092ce5e92ea30d0ea5d07fc7c03f2233d0bc170d2f02e31a&=&format=webp&quality=lossless&width=953&height=468" alt="mongodb-setp-02" width="500" height="auto">

Enter the name you want and click **Next**

<img src="https://media.discordapp.net/attachments/1215229094107545681/1215233203724615680/3.png?ex=65fc011d&is=65e98c1d&hm=8bee7cb002000f70ffc6c4078f1b737565a5b315ee3f81e503b6f345017a6c54&=&format=webp&quality=lossless&width=424&height=385" alt="mongodb-setp-03" width="500" height="auto">

You will see this screen, so just click **Create Project**

<img src="https://media.discordapp.net/attachments/1215229094107545681/1215233262763507753/4.png?ex=65fc012b&is=65e98c2b&hm=4934ee527bf88be16a8fdc8ec6a5b474ef719e32cf3c21dc0297fd0bd4b78141&=&format=webp&quality=lossless&width=685&height=468" alt="mongodb-setp-04" width="500" height="auto">

You will be redirected to your project home screen

Initially you will have nothing, so click **Create**

<img src="https://media.discordapp.net/attachments/1215229094107545681/1215233556935217203/image.png?ex=65fc0171&is=65e98c71&hm=22ca3c61688fe8c4a6f55888e8413452a6106cccd899bda1e41ddfbb568cc7d2&=&format=webp&quality=lossless&width=738&height=468" alt="mongodb-setp-05" width="500" height="auto">

Choose the **M0** free plan

<img src="https://media.discordapp.net/attachments/1215229094107545681/1215233784304242708/image.png?ex=65fc01a8&is=65e98ca8&hm=1e4fcbc937f76e32123d406e1f1d299dd9c91092443685136f41f8e246c27be0&=&format=webp&quality=lossless&width=1025&height=223" alt="mongodb-setp-06" width="500" height="auto">

Choose the provider you want, then select the region (It is recommended to choose the one closest to your application).
Enter whatever name you prefer for the cluster.

<img src="https://media.discordapp.net/attachments/1215229094107545681/1215233963224993792/image.png?ex=65fc01d2&is=65e98cd2&hm=668bd0049219a9eb5fd0e75cb4022943949897220c2008e7ebe636daa3930eed&=&format=webp&quality=lossless&width=497&height=468" alt="mongodb-setp-07" width="500" height="auto">

At the bottom of the page click **Create**

<img src="https://media.discordapp.net/attachments/1215229094107545681/1215234337008652308/image.png?ex=65fc022b&is=65e98d2b&hm=c2f216f102ba6e3da97a0aeeb6a3e6544014153fcf51bdfc3b85613bafedaf5f&=&format=webp&quality=lossless&width=1025&height=171" alt="mongodb-setp-08" width="500" height="auto">

- ⚠️ This step is very important

Create a user to be able to access the database! Set the name you want and the password (It is recommended to click to generate the password automatically).
- ⚠️ Click to copy this password and save it for later use
Keep scrolling down the page and you will reach the last step

<img src="https://media.discordapp.net/attachments/1215229094107545681/1215234593347739680/image.png?ex=65fc0269&is=65e98d69&hm=2a3c2234177a0caff8d8c8a53e1da1bc0c13c1287cdcaac5710726eb585ffff7&=&format=webp&quality=lossless&width=498&height=385" alt="mongodb-setp-09" width="500" height="auto">

Add an IP address and click Add Entry
Adding the IP 0.0.0.0/0 will allow your bot that is hosted anywhere to connect to the database

Lastly click on **Finish and Close**

<img src="https://media.discordapp.net/attachments/1215229094107545681/1215235603935920229/5.png?ex=65fc0359&is=65e98e59&hm=54b857c0f19707e42960e337b6969969e27582b78317428da00c11887eb286ea&=&format=webp&quality=lossless&width=618&height=468" alt="mongodb-setp-10" width="500" height="auto">

Click **Connect**

<img src="https://media.discordapp.net/attachments/1215229094107545681/1215236143789113354/image.png?ex=65fc03da&is=65e98eda&hm=de42194b55d7c80c2fa211f490c84867bbe75c8901174733939898a15c7ae6ae&=&format=webp&quality=lossless&width=764&height=468" alt="mongodb-setp-11" width="500" height="auto">

Then select **Drivers**

<img src="https://media.discordapp.net/attachments/1215229094107545681/1215236498631430144/6.png?ex=65fc042f&is=65e98f2f&hm=97d2deecd2fd512fe1cd05e6dbfe146689cb97e9aa0350ef996ff0602c66c28e&=&format=webp&quality=lossless&width=572&height=467" alt="mongodb-setp-11" width="500" height="auto">

Click to copy your database **URI**

<img src="https://media.discordapp.net/attachments/1215229094107545681/1215236932813197312/7.png?ex=65fc0496&is=65e98f96&hm=7ab8597c31d27d11b039ddba782e5a21590a18324f8835aef99513ba67d7bab8&=&format=webp&quality=lossless&width=506&height=468" alt="mongodb-setp-13" width="500" height="auto">

Note that right below it says to replace **<password>** with the password you defined for your user

- mongodb+srv://root:`<password>`@cluster0.doy8zej.mon...
- mongodb+srv://root:`T8g4Hrlqi7LUK0XG`@cluster0.doy8zej.mon...

With your database URI in hand, you can now use it in your projects to connect.

Define it in the .env file

<img src="https://media.discordapp.net/attachments/1215229094107545681/1215977923660480512/image.png?ex=65feb6b0&is=65ec41b0&hm=595b29896dcf651723e65ba1c2a076b27d92ed214f768e21f11db64ba7aaf5cc&=&format=webp&quality=lossless&width=445&height=114" alt="mongodb-setp-13" width="500" height="auto">