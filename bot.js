const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType, WebhookClient } = require('discord.js');
const axios = require('axios');
const fs = require('fs');

const token = 'MTUwNTE2OTA5NTIyNDcyNTU4NA.GJ0XMq.LAfU03BFGNJ7M2FuTDT_XDlCHg5iV80xvMDzOA';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildMessageReactions
    ]
});

if (!fs.existsSync('admins.json')) {
    const defaultAdmins = ['1219957631578542090', '1400892722340167953'];
    fs.writeFileSync('admins.json', JSON.stringify(defaultAdmins, null, 2));
    console.log('[Seramic] Da tao file admins.json');
}

if (!fs.existsSync('sent_jobs.json')) {
    fs.writeFileSync('sent_jobs.json', JSON.stringify({}, null, 2));
    console.log('[Seramic] Da tao file sent_jobs.json');
}

let adminList = JSON.parse(fs.readFileSync('admins.json', 'utf8'));
let sentJobs = JSON.parse(fs.readFileSync('sent_jobs.json', 'utf8'));

let notifyStatus = false;
let notifyInterval = null;

const API_URL = 'https://seramic-apihopbf.up.railway.app/api';

const CHARACTERS = [
    "CakePrince", "CakeQueen", "CursedCaptain", "Darkbeard",
    "DoughKing", "Elite", "FullMoon", "Fullmoon",
    "Mirage", "Oroshi", "PureRed", "RaidCastle",
    "RipIndra", "Saishi", "Shizu", "SnowWhite",
    "SoulReaper", "WinterSky"
];

const CHARACTER_WEBHOOKS = {};
const ANNOUNCE_WEBHOOK = {};
let GUILD_ID = null;

const encodeMap = {
    "a": "#1@2#1@2", "b": "$3%4$3%4", "c": "^5&6^5&6", "d": "*7(8*7(8",
    "e": ")9-0)9-0", "f": "!1_2!1_2", "g": "+3=4+3=4", "h": "?5/6?5/6",
    "i": "@7#8@7#8", "j": "$9%0$9%0", "k": "^1&2^1&2", "l": "*3(4*3(4",
    "m": ")5-6)5-6", "n": "!7_8!7_8", "o": "+9=0+9=0", "p": "?1/2?1/2",
    "q": "@3#4@3#4", "r": "$5%6$5%6", "s": "^7&8^7&8", "t": "*9(0*9(0",
    "u": ")1-2)1-2", "v": "!3_4!3_4", "w": "+5=6+5=6", "x": "?7/8?7/8",
    "y": "@9#0@9#0", "z": "$1%2$1%2",
    "A": "^3&4^3&4", "B": "*5(6*5(6", "C": ")7-8)7-8", "D": "!9_0!9_0",
    "E": "+1=2+1=2", "F": "?3/4?3/4", "G": "@5#6@5#6", "H": "$7%8$7%8",
    "I": "^9&0^9&0", "J": "*1(2*1(2", "K": ")3-4)3-4", "L": "!5_6!5_6",
    "M": "+7=8+7=8", "N": "?9/0?9/0", "O": "@1#2@1#2", "P": "$3%4$3%4",
    "Q": "^5&6^5&6", "R": "*7(8*7(8", "S": ")9-0)9-0", "T": "!1_2!1_2",
    "U": "+3=4+3=4", "V": "?5/6?5/6", "W": "@7#8@7#8", "X": "$9%0$9%0",
    "Y": "^1&2^1&2", "Z": "*3(4*3(4",
    "0": "#$@$!!$$", "1": "*%&%#%#%", "2": "*^&%^$^^&%", "3": "!@#$!@#$",
    "4": "%^&*+)&^", "5": "+_*^*&*$", "6": "!@##!!##!#", "7": "!@#$%^*)(",
    "8": "%^&*!@##", "9": "#$!$#$$#",
    "-": "@#$%4%^2", "_": "a@!#P!@!2"
};

function decodeV2(encoded) {
    if (!encoded || typeof encoded !== 'string') return null;
    if (encoded.substring(0, 13) !== "KuriWasHere-") return null;
    if (encoded.substring(encoded.length - 2) !== "==") return null;
    
    const clean = encoded.substring(13, encoded.length - 2);
    let result = "";
    let i = 0;
    
    const reverseMap = {};
    for (const [key, value] of Object.entries(encodeMap)) {
        reverseMap[value] = key;
    }
    
    while (i < clean.length) {
        let found = false;
        for (let len = 4; len >= 1; len--) {
            const chunk = clean.substring(i, i + len);
            if (reverseMap[chunk]) {
                result += reverseMap[chunk];
                i += len;
                found = true;
                break;
            }
        }
        if (!found) {
            i++;
        }
    }
    return result;
}

function isAdmin(userId) {
    return adminList.includes(userId);
}

async function checkApiStatus() {
    try {
        const response = await axios.get(API_URL);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function getCharacterData(character) {
    try {
        const response = await axios.get(`${API_URL}/${character}`);
        if (response.data && response.data.success && response.data.data) {
            return response.data.data;
        }
        return [];
    } catch (error) {
        return [];
    }
}

function getJobIdKey(jobId, placeId) {
    return `${jobId}_${placeId}`;
}

function saveAdmins() {
    try {
        fs.writeFileSync('admins.json', JSON.stringify(adminList, null, 2));
    } catch (e) {
        console.error('[Seramic] Loi luu admins.json:', e);
    }
}

function saveSentJobs() {
    try {
        fs.writeFileSync('sent_jobs.json', JSON.stringify(sentJobs, null, 2));
    } catch (e) {
        console.error('[Seramic] Loi luu sent_jobs.json:', e);
    }
}

client.once('ready', async () => {
    console.log(`[Seramic] Bot da san sang! Logged in as ${client.user.tag}`);
    
    const commands = [
        new SlashCommandBuilder()
            .setName('setup-notify')
            .setDescription('Tao kenh va webhook cho notify'),
        new SlashCommandBuilder()
            .setName('run-notify')
            .setDescription('Bat dau chay notify'),
        new SlashCommandBuilder()
            .setName('stop-notify')
            .setDescription('Dung notify'),
        new SlashCommandBuilder()
            .setName('give-admin')
            .setDescription('Cap quyen admin cho nguoi khac')
            .addStringOption(option => 
                option.setName('userid')
                    .setDescription('ID Discord cua nguoi dung')
                    .setRequired(true)),
        new SlashCommandBuilder()
            .setName('delete-admin')
            .setDescription('Xoa quyen admin cua nguoi khac')
            .addStringOption(option => 
                option.setName('userid')
                    .setDescription('ID Discord cua nguoi dung')
                    .setRequired(true)),
        new SlashCommandBuilder()
            .setName('check-status')
            .setDescription('Kiem tra trang thai API'),
        new SlashCommandBuilder()
            .setName('admin-list')
            .setDescription('Xem danh sach admin')
    ];

    const rest = new REST({ version: '10' }).setToken(token);

    try {
        console.log('[Seramic] Dang dang ky slash commands...');
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands.map(cmd => cmd.toJSON()) }
        );
        console.log('[Seramic] Da dang ky slash commands!');
    } catch (error) {
        console.error('[Seramic] Loi dang ky commands:', error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, user } = interaction;

    if (!isAdmin(user.id) && commandName !== 'check-status') {
        return interaction.reply({
            content: 'Ban khong co quyen su dung lenh nay!',
            ephemeral: true
        });
    }

    if (commandName === 'setup-notify') {
        await interaction.deferReply({ ephemeral: true });
        
        try {
            const guild = interaction.guild;
            GUILD_ID = guild.id;
            
            const category = await guild.channels.create({
                name: 'Notification BF',
                type: ChannelType.GuildCategory
            });
            
            const announceChannel = await guild.channels.create({
                name: 'announce-notify',
                type: ChannelType.GuildText,
                parent: category.id
            });
            
            const announceWebhook = await announceChannel.createWebhook({
                name: 'Seramic Notify',
                avatar: 'https://cdn.discordapp.com/attachments/...'
            });
            ANNOUNCE_WEBHOOK[guild.id] = announceWebhook.url;
            
            for (const char of CHARACTERS) {
                const channelName = char === 'Fullmoon' ? 'near-fullmoon' : char.toLowerCase();
                
                const channel = await guild.channels.create({
                    name: `notify-${channelName}`,
                    type: ChannelType.GuildText,
                    parent: category.id
                });
                
                const webhook = await channel.createWebhook({
                    name: `${char} Notify`,
                    avatar: 'https://cdn.discordapp.com/attachments/...'
                });
                
                CHARACTER_WEBHOOKS[`${guild.id}_${char}`] = webhook.url;
            }
            
            await interaction.editReply({
                content: `Da tao xong category va cac kenh notify!\nDanh muc: Notification BF\nSo kenh: ${CHARACTERS.length + 1}`
            });
            
        } catch (error) {
            console.error('[Seramic] Loi setup-notify:', error);
            await interaction.editReply({
                content: `Loi khi setup: ${error.message}`
            });
        }
    }

    if (commandName === 'run-notify') {
        await interaction.deferReply({ ephemeral: true });
        
        if (notifyStatus) {
            return interaction.editReply({
                content: 'Notify da dang chay!'
            });
        }
        
        notifyStatus = true;
        
        const notifyLoop = async () => {
            if (!notifyStatus) return;
            
            try {
                for (const char of CHARACTERS) {
                    const data = await getCharacterData(char);
                    const guildId = interaction.guild.id;
                    
                    const webhookUrl = CHARACTER_WEBHOOKS[`${guildId}_${char}`];
                    if (!webhookUrl) continue;
                    
                    const webhookClient = new WebhookClient({ url: webhookUrl });
                    
                    for (const item of data) {
                        const key = getJobIdKey(item.jobId, item.placeId);
                        
                        if (!sentJobs[key]) {
                            const decoded = decodeV2(item.jobId);
                            if (decoded) {
                                const embed = new EmbedBuilder()
                                    .setColor(0x00ff00)
                                    .setTitle(`${char} Notify - Skidder Hideout`)
                                    .setDescription(`**Type:** ${char}`)
                                    .addFields(
                                        { name: 'Player count', value: `${item.players}`, inline: true },
                                        { name: 'Place ID', value: `${item.placeId}`, inline: true },
                                        { name: 'Job ID', value: `\`${decoded}\``, inline: false }
                                    )
                                    .addFields(
                                        { name: 'Join Script', value: `\`\`\`lua\ngame:GetService("ReplicatedStorage").__ServerBrowser:InvokeServer("teleport", "${decoded}")\n\`\`\``, inline: false }
                                    )
                                    .setFooter({ text: `Made by @seramic.3060 • ${new Date().toLocaleString('vi-VN')}` });
                                
                                await webhookClient.send({ embeds: [embed] });
                                
                                sentJobs[key] = {
                                    jobId: item.jobId,
                                    placeId: item.placeId,
                                    sentAt: Date.now()
                                };
                                
                                saveSentJobs();
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('[Seramic] Loi notify loop:', error);
            }
        };
        
        const intervalId = setInterval(notifyLoop, 5000);
        notifyInterval = intervalId;
        
        await interaction.editReply({
            content: 'Da bat dau notify! Se kiem tra moi 5 giay.'
        });
    }

    if (commandName === 'stop-notify') {
        await interaction.deferReply({ ephemeral: true });
        
        if (!notifyStatus) {
            return interaction.editReply({
                content: 'Notify chua chay!'
            });
        }
        
        notifyStatus = false;
        if (notifyInterval) {
            clearInterval(notifyInterval);
            notifyInterval = null;
        }
        
        await interaction.editReply({
            content: 'Da dung notify!'
        });
    }

    if (commandName === 'give-admin') {
        await interaction.deferReply({ ephemeral: true });
        
        const userId = interaction.options.getString('userid');
        
        if (adminList.includes(userId)) {
            return interaction.editReply({
                content: `User <@${userId}> da co quyen admin!`
            });
        }
        
        adminList.push(userId);
        saveAdmins();
        
        await interaction.editReply({
            content: `Da cap quyen admin cho <@${userId}>!`
        });
    }

    if (commandName === 'delete-admin') {
        await interaction.deferReply({ ephemeral: true });
        
        const userId = interaction.options.getString('userid');
        
        if (ADMIN_IDS.includes(userId)) {
            return interaction.editReply({
                content: `Khong the xoa quyen admin cua bot owner!`
            });
        }
        
        if (!adminList.includes(userId)) {
            return interaction.editReply({
                content: `User <@${userId}> khong co quyen admin!`
            });
        }
        
        adminList = adminList.filter(id => id !== userId);
        saveAdmins();
        
        await interaction.editReply({
            content: `Da xoa quyen admin cua <@${userId}>!`
        });
    }

    if (commandName === 'check-status') {
        await interaction.deferReply({ ephemeral: true });
        
        const status = await checkApiStatus();
        
        const embed = new EmbedBuilder()
            .setColor(status.success ? 0x00ff00 : 0xff0000)
            .setTitle('API Status')
            .setDescription(status.success ? 'API dang hoat dong binh thuong!' : 'API khong the ket noi!')
            .addFields(
                { name: 'Status', value: status.success ? 'Online' : 'Offline', inline: true },
                { name: 'URL', value: API_URL, inline: false }
            )
            .setTimestamp();
        
        if (status.success && status.data) {
            embed.addFields(
                { name: 'Message', value: status.data.message || 'N/A', inline: false }
            );
        }
        
        if (!status.success) {
            embed.addFields(
                { name: 'Error', value: status.error || 'Unknown error', inline: false }
            );
        }
        
        await interaction.editReply({
            embeds: [embed]
        });
    }

    if (commandName === 'admin-list') {
        await interaction.deferReply({ ephemeral: true });
        
        const adminMentions = adminList.map(id => `<@${id}>`).join('\n');
        
        const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle('Danh sach Admin')
            .setDescription(adminMentions || 'Khong co admin nao!')
            .setFooter({ text: `Tong so admin: ${adminList.length}` })
            .setTimestamp();
        
        await interaction.editReply({
            embeds: [embed]
        });
    }
});

client.login(token);
