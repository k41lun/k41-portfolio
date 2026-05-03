export type Lang = 'en' | 'ja' | 'zh-TW' | 'zh-CN' | 'ko'

export const LANGS: { code: Lang; label: string }[] = [
  { code: 'en',    label: 'EN' },
  { code: 'ja',    label: '日' },
  { code: 'zh-TW', label: '繁' },
  { code: 'zh-CN', label: '简' },
  { code: 'ko',    label: '한' },
]

export const T: Record<Lang, {
  online: string; idle: string; dnd: string; offline: string
  lastSeen: string
  bio: string[]
  currentlyPlaying: string
  recentSteam: string
  thisWeek: string; total: string
  screenshots: string; totalShots: string
  findMeOn: string
  guestbook: string; yourName: string; leaveMessage: string
  sign: string; sending: string; thanks: string; noMessages: string
  nowPlaying: string
  visitors: string; builtBy: string
}> = {
  en: {
    online: 'ONLINE', idle: 'IDLE', dnd: 'DO NOT DISTURB', offline: 'OFFLINE',
    lastSeen: 'last seen',
    bio: [
      'Worst at English.',
      'Worstest at Japanese.',
      'Part-time Warrior of Light,',
      'full-time vibe coder.',
    ],
    currentlyPlaying: 'Currently playing',
    recentSteam: 'Recently on Steam',
    thisWeek: 'this week', total: 'total',
    screenshots: 'Screenshots', totalShots: 'total screenshots',
    findMeOn: 'Find me on',
    guestbook: 'Guestbook', yourName: 'Your name', leaveMessage: 'Leave a message...',
    sign: 'SIGN →', sending: 'SENDING...', thanks: 'Thanks for signing! ✓',
    noMessages: 'No messages yet — be the first to sign!',
    nowPlaying: 'NOW PLAYING',
    visitors: 'visitors', builtBy: 'built by Ping Ping',
  },
  ja: {
    online: 'オンライン', idle: '離席中', dnd: '取り込み中', offline: 'オフライン',
    lastSeen: '最終確認',
    bio: [
      '英語も下手、',
      '日本語はもっと下手。',
      'パートタイム光の戦士、',
      'フルタイムのバイブコーダー。',
    ],
    currentlyPlaying: 'プレイ中',
    recentSteam: 'Steamの最近のゲーム',
    thisWeek: '今週', total: '合計',
    screenshots: 'スクリーンショット', totalShots: '枚',
    findMeOn: '連絡先',
    guestbook: '掲示板', yourName: 'お名前', leaveMessage: 'メッセージを残す...',
    sign: '送信 →', sending: '送信中...', thanks: 'ありがとう！✓',
    noMessages: 'まだメッセージがありません',
    nowPlaying: '再生中',
    visitors: '訪問者', builtBy: 'Ping Pingが制作',
  },
  'zh-TW': {
    online: '上線', idle: '閒置', dnd: '請勿打擾', offline: '離線',
    lastSeen: '最後上線',
    bio: [
      '英文最差，',
      '日文更差。',
      '兼職光之戰士，',
      '全職氛圍編程師。',
    ],
    currentlyPlaying: '正在遊玩',
    recentSteam: 'Steam 近期遊戲',
    thisWeek: '本週', total: '總計',
    screenshots: '截圖', totalShots: '張截圖',
    findMeOn: '找我',
    guestbook: '留言板', yourName: '你的名字', leaveMessage: '留下訊息...',
    sign: '留言 →', sending: '傳送中...', thanks: '感謝留言！✓',
    noMessages: '還沒有留言，來第一個吧！',
    nowPlaying: '正在播放',
    visitors: '訪客', builtBy: 'Ping Ping 製作',
  },
  'zh-CN': {
    online: '在线', idle: '闲置', dnd: '请勿打扰', offline: '离线',
    lastSeen: '最后上线',
    bio: [
      '英文最差，',
      '日文更差。',
      '兼职光之战士，',
      '全职氛围编程师。',
    ],
    currentlyPlaying: '正在游玩',
    recentSteam: 'Steam 近期游戏',
    thisWeek: '本周', total: '总计',
    screenshots: '截图', totalShots: '张截图',
    findMeOn: '找我',
    guestbook: '留言板', yourName: '你的名字', leaveMessage: '留下消息...',
    sign: '留言 →', sending: '发送中...', thanks: '感谢留言！✓',
    noMessages: '还没有留言，来第一个吧！',
    nowPlaying: '正在播放',
    visitors: '访客', builtBy: 'Ping Ping 制作',
  },
  ko: {
    online: '온라인', idle: '자리비움', dnd: '방해금지', offline: '오프라인',
    lastSeen: '마지막 접속',
    bio: [
      '영어도 못하고,',
      '일본어는 더 못해요.',
      '파트타임 빛의 전사,',
      '풀타임 바이브 코더.',
    ],
    currentlyPlaying: '현재 플레이 중',
    recentSteam: 'Steam 최근 게임',
    thisWeek: '이번 주', total: '총',
    screenshots: '스크린샷', totalShots: '개의 스크린샷',
    findMeOn: '찾는 곳',
    guestbook: '방명록', yourName: '이름', leaveMessage: '메시지를 남겨주세요...',
    sign: '작성 →', sending: '전송 중...', thanks: '감사합니다! ✓',
    noMessages: '아직 메시지가 없습니다. 첫 번째로 남겨보세요!',
    nowPlaying: '재생 중',
    visitors: '방문자', builtBy: 'Ping Ping 제작',
  },
}