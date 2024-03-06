# Guide

- [Guide in potuguese](https://discord.com/channels/537817462272557057/1166401248992440350)

# Creating a Firestore Database
You need to have a Firebase account!

If you don't have one, please go to https://console.firebase.google.com/ and log in with your Google account.

Let's create a project

<img src="https://media.discordapp.net/attachments/1166401248992440350/1166401382492934164/image.png?ex=65f9b270&is=65e73d70&hm=e8ad1187fce9a75be73cb5ef44961e7edafb4db6c9e736281a55bc4c0d72a09b&=&format=webp&quality=lossless&width=965&height=468" alt="firestore-setp-01" width="500" height="auto">

Give your project a name and continue

<img src="https://media.discordapp.net/attachments/1166401248992440350/1166401442760884314/image.png?ex=65f9b27e&is=65e73d7e&hm=d181d56466748979644716dbef3487d5c60bc5721e8b435dfd5ff556b2a7c40d&=&format=webp&quality=lossless&width=999&height=468" alt="firestore-setp-02" width="500" height="auto">

Leave this option unchecked if you prefer

<img src="https://media.discordapp.net/attachments/1166401248992440350/1166401490114576385/image.png?ex=65f9b289&is=65e73d89&hm=54061ebb695f4aeb9ff20c81b8b57bc3d5beb00ad5ce8446115a4644f4e4f6b2&=&format=webp&quality=lossless&width=994&height=468" alt="firestore-setp-03" width="500" height="auto">

Now click on Firestore Database in the sidebar

<img src="https://media.discordapp.net/attachments/1166401248992440350/1166401587644731492/image.png?ex=65f9b2a1&is=65e73da1&hm=80cb2bed3d49f55e1600dcb61553e588c40c35dcb8a8eff5aa3776dbcd1aa934&=&format=webp&quality=lossless&width=605&height=339" alt="firestore-setp-04" width="500" height="auto">

Create a new database

<img src="https://media.discordapp.net/attachments/1166401248992440350/1166401619760521307/image.png?ex=65f9b2a8&is=65e73da8&hm=18f643eaf5c8c568f7fc51cd8e7bcd8a7ffa1392a91121ed2e76a2122eab6c58&=&format=webp&quality=lossless&width=1025&height=423" alt="firestore-setp-05" width="500" height="auto">

Leave "production mode" checked and click next

<img src="https://media.discordapp.net/attachments/1166401248992440350/1166401671849594890/image.png?ex=65f9b2b5&is=65e73db5&hm=ce5463df7fc83a3c918db4f0facc67c6b45e4b2204a111910c1bcc14c19a0117&=&format=webp&quality=lossless&width=709&height=468" alt="firestore-setp-06" width="500" height="auto">

Choose the location of your database (recommended to be closer to your application's location)

<img src="https://media.discordapp.net/attachments/1166401248992440350/1166401720314757240/image.png?ex=65f9b2c0&is=65e73dc0&hm=aa5ddef8a062ec3a372d1aac7a7a18dc52e0649ec3d71ff35dc7db21616e2454&=&format=webp&quality=lossless&width=564&height=468" alt="firestore-setp-07" width="500" height="auto">

Now you have a Firestore database

<img src="https://media.discordapp.net/attachments/1166401248992440350/1166401810181918780/image.png?ex=65f9b2d6&is=65e73dd6&hm=87dac62b5cea3e3c9cc0ae2114344ed19f4c30aa135cd76055073e0b6aff3fcd&=&format=webp&quality=lossless&width=781&height=468" alt="firestore-setp-08" width="500" height="auto">

Access the project settings

<img src="https://media.discordapp.net/attachments/1166401248992440350/1166401900732747846/image.png?ex=65f9b2eb&is=65e73deb&hm=a6adc361bc9bda7c68ea7d6d86d4cb2a86e1cb894cc1bcf3614636d7795388a2&=&format=webp&quality=lossless&width=845&height=288" alt="firestore-setp-09" width="500" height="auto">

Go to service accounts and click on generate new private key

<img src="https://media.discordapp.net/attachments/1166401248992440350/1166401947180478494/image.png?ex=65f9b2f6&is=65e73df6&hm=1ecc569a3ecd07678f9a1a1c52030b20e5d04a1d6001c62881248b7bdddf3a22&=&format=webp&quality=lossless&width=605&height=360" alt="firestore-setp-10" width="500" height="auto">

You will be able to save this file on your computer

<img src="https://media.discordapp.net/attachments/1166401248992440350/1166402014297739334/image.png?ex=65f9b306&is=65e73e06&hm=0dbfe034042da20cecf7e78d4e2b542ee3c9f94fdb7d0faf2ef53938996066f0&=&format=webp&quality=lossless&width=727&height=468" alt="firestore-setp-11" width="500" height="auto">

Rename the file to "firebase.json"

<img src="https://media.discordapp.net/attachments/1166401248992440350/1166402067301142658/image.png?ex=65f9b313&is=65e73e13&hm=7da6bed9fd15b4f4a917916ba0b1f69c756b0815a9d2d89325a214f7faf6b6c6&=&format=webp&quality=lossless&width=963&height=256" alt="firestore-setp-13" width="500" height="auto">

Save it in the root of your project

You're ready to use it!