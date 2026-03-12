<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Meridian</title>
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%23ff8c00'/%3E%3Cg fill='white'%3E%3Cpath d='M50 22l28 14-28 14-28-14z'/%3E%3Cpath d='M22 57l28 14 28-14-5-2.5-23 11.5-23-11.5z'/%3E%3Cpath d='M22 46l28 14 28-14-5-2.5-23 11.5-23-11.5z'/%3E%3C/g%3E%3C/svg%3E">
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist+Mono:wght@300;400;500&family=Geist:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #0d0d0d; --sidebar: #111111; --surface: #1a1a1a; --surface2: #222222;
  --border: #2a2a2a; --border-light: #333333; --accent: #ff8c00;
  --accent-dim: rgba(255,140,0,0.12); --accent-border: rgba(255,140,0,0.25);
  --text: #ececec; --text-2: #a0a0a0; --text-3: #606060;
  --user-bg: #2a1a00; --sidebar-width: 260px;
}
html, body { height: 100%; background: #0d0d0d; color: var(--text); font-family: 'Geist', sans-serif; overflow: hidden; }

@keyframes fadeUp    { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeIn    { from{opacity:0} to{opacity:1} }
@keyframes scaleIn   { from{transform:scale(0.92);opacity:0} to{transform:scale(1);opacity:1} }
@keyframes shake     { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
@keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:0.4} }
@keyframes activePulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
@keyframes orbFloat  { 0%,100%{transform:translateY(0) scale(1);opacity:0.4} 50%{transform:translateY(-8px) scale(1.4);opacity:1} }
@keyframes scanBar   { 0%{transform:translateX(-100%)} 100%{transform:translateX(400%)} }
@keyframes labelPulse{ 0%,100%{opacity:0.3} 50%{opacity:1} }
@keyframes logoFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
@keyframes logoPop   { from{transform:scale(0.5) rotate(-10deg);opacity:0} to{transform:scale(1) rotate(0);opacity:1} }
@keyframes miniBarPop{ from{transform:scaleY(0);opacity:0} to{transform:scaleY(1);opacity:0.8} }
@keyframes liveBlink { 0%,100%{opacity:1} 50%{opacity:0.2} }
@keyframes avatarPop { from{transform:scale(0)} to{transform:scale(1)} }
@keyframes warnPop   { from{transform:scale(0.88);opacity:0} to{transform:scale(1);opacity:1} }

/* ── Warning ── */
#warningScreen {
  position: fixed; inset: 0; z-index: 9999;
  background: #0d0d0d;
  display: flex; align-items: center; justify-content: center; padding: 24px;
  transition: opacity 0.5s ease;
}
.warn-box {
  background: #111; border: 1px solid #2a2a2a; border-radius: 24px;
  max-width: 460px; width: 100%; padding: 48px 40px;
  text-align: center; display: flex; flex-direction: column; align-items: center; gap: 22px;
  animation: warnPop 0.5s cubic-bezier(0.34,1.4,0.64,1) forwards;
}
.warn-logo {
  width: 68px; height: 68px; border-radius: 20px; background: var(--accent);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 48px rgba(255,140,0,0.45); animation: logoFloat 3s ease infinite;
}
.warn-title { font-family: 'Instrument Serif', serif; font-size: 28px; line-height: 1.2; }
.warn-body  { font-size: 14px; color: var(--text-2); line-height: 1.85; max-width: 340px; }
.warn-body strong { color: var(--text); }
.warn-divider { width: 100%; height: 1px; background: #2a2a2a; }
.warn-fine { font-size: 12px; color: var(--text-3); line-height: 1.7; }
.warn-btn {
  width: 100%; padding: 15px; background: var(--accent); border: none; border-radius: 12px;
  color: #0d0d0d; font-family: 'Geist', sans-serif; font-size: 15px; font-weight: 600;
  cursor: pointer; transition: all 0.2s; letter-spacing: 0.02em;
}
.warn-btn:hover { background: #e07d00; transform: translateY(-1px); box-shadow: 0 6px 28px rgba(255,140,0,0.4); }
.warn-btn:active { transform: translateY(0); }
.warn-decline { font-size: 12px; color: var(--text-3); cursor: pointer; transition: color 0.15s; }
.warn-decline:hover { color: var(--text-2); }

/* ── App shell ── */
#appShell { position: fixed; inset: 0; opacity: 0; pointer-events: none; transition: opacity 0.5s ease; }
#appShell.visible { opacity: 1; pointer-events: all; }
.layout { display: flex; height: 100vh; }

/* ── Sidebar ── */
.sidebar { width: var(--sidebar-width); background: var(--sidebar); border-right: 1px solid var(--border); display: flex; flex-direction: column; flex-shrink: 0; padding: 16px 12px; gap: 8px; transition: transform 0.25s ease; z-index: 30; }
.sidebar-logo { display: flex; align-items: center; justify-content: space-between; padding: 10px 10px 16px; border-bottom: 1px solid var(--border); margin-bottom: 4px; }
.sidebar-logo-left { display: flex; align-items: center; gap: 10px; }
.logo-mark { width: 30px; height: 30px; border-radius: 8px; background: var(--accent); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.logo-name { font-family: 'Instrument Serif', serif; font-size: 18px; }
.sidebar-collapse-btn { width: 28px; height: 28px; border-radius: 7px; border: 1px solid var(--border-light); background: var(--surface); color: var(--text-3); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; flex-shrink: 0; }
.sidebar-collapse-btn:hover { background: var(--surface2); color: var(--text-2); }
.sidebar-collapse-btn svg { width: 14px; height: 14px; }
.new-chat-btn { display: flex; align-items: center; gap: 8px; padding: 9px 12px; border-radius: 8px; border: 1px solid var(--border-light); background: transparent; color: var(--text-2); font-family: 'Geist', sans-serif; font-size: 13px; cursor: pointer; transition: all 0.15s; width: 100%; text-align: left; }
.new-chat-btn:hover { background: var(--surface); color: var(--text); }
.new-chat-btn svg { width: 14px; height: 14px; flex-shrink: 0; }
.history-header { display: flex; align-items: center; justify-content: space-between; padding: 8px 10px 4px; cursor: pointer; border-radius: 6px; transition: background 0.15s; user-select: none; }
.history-header:hover { background: var(--surface); }
.sidebar-section-label { font-size: 10px; font-weight: 500; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.1em; }
.history-toggle-btn { width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; color: var(--text-3); transition: transform 0.2s; }
.history-toggle-btn svg { width: 10px; height: 10px; }
.history-toggle-btn.collapsed { transform: rotate(-90deg); }
.chat-history-list { overflow: hidden; transition: max-height 0.3s ease, opacity 0.25s ease; max-height: 300px; opacity: 1; }
.chat-history-list.collapsed { max-height: 0; opacity: 0; }
.chat-history-item { display: flex; align-items: center; gap: 6px; padding: 7px 10px; border-radius: 7px; font-size: 12.5px; color: var(--text-2); cursor: pointer; transition: all 0.15s; }
.chat-history-item:hover { background: var(--surface); color: var(--text); }
.chat-history-item.active { background: var(--surface2); color: var(--text); }
.chat-item-name { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.chat-delete-btn { width: 18px; height: 18px; border-radius: 4px; border: none; background: none; color: var(--text-3); cursor: pointer; display: none; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.15s; padding: 0; }
.chat-delete-btn:hover { background: rgba(255,80,80,0.15); color: #ff6060; }
.chat-delete-btn svg { width: 11px; height: 11px; }
.sidebar-footer { margin-top: auto; padding-top: 12px; border-top: 1px solid var(--border); }
.sidebar-footer-btn { display: flex; align-items: center; gap: 9px; padding: 9px 10px; border-radius: 7px; font-size: 12.5px; color: var(--text-2); cursor: pointer; transition: all 0.15s; width: 100%; background: none; border: none; font-family: 'Geist', sans-serif; }
.sidebar-footer-btn:hover { background: var(--surface); color: var(--text); }
.sidebar-footer-btn svg { width: 14px; height: 14px; flex-shrink: 0; }

/* ── Main ── */
.main { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
.topbar { display: flex; align-items: center; justify-content: space-between; padding: 14px 24px; border-bottom: 1px solid var(--border); flex-shrink: 0; gap: 12px; }
.topbar-right { display: flex; align-items: center; gap: 10px; }
.model-pill { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text-2); background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 6px 12px; }
.model-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); animation: pulse 2s ease infinite; }
.active-users-pill { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text-2); background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 6px 12px; }
.active-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; animation: activePulse 2.5s ease infinite; }
.active-dot.high { background: #4ade80; box-shadow: 0 0 6px rgba(74,222,128,0.5); }
.active-dot.mid  { background: #facc15; box-shadow: 0 0 6px rgba(250,204,21,0.5); }
.active-dot.low  { background: #f87171; box-shadow: 0 0 6px rgba(248,113,113,0.5); }

/* ── Chat ── */
.chat-scroll { flex: 1; overflow-y: auto; scroll-behavior: smooth; }
.chat-scroll::-webkit-scrollbar { width: 4px; }
.chat-scroll::-webkit-scrollbar-thumb { background: var(--border-light); border-radius: 2px; }
.chat-inner { max-width: 720px; margin: 0 auto; padding: 32px 24px; display: flex; flex-direction: column; gap: 0; }
.message { display: flex; gap: 16px; padding: 20px 0; border-bottom: 1px solid var(--border); animation: fadeUp 0.25s ease forwards; opacity: 0; }
.message:last-child { border-bottom: none; }
.message.user { flex-direction: row-reverse; }
.msg-avatar { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
.msg-avatar.ai { background: var(--accent); animation: avatarPop 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.msg-avatar.user { background: var(--surface2); border: 1px solid var(--border-light); color: var(--text-2); font-family: 'Instrument Serif', serif; font-size: 15px; font-weight: 600; }
.msg-content { flex: 1; min-width: 0; }
.msg-name { font-size: 12px; font-weight: 600; color: var(--text-2); margin-bottom: 6px; letter-spacing: 0.03em; }
.message.user .msg-name { text-align: right; }
.msg-text { font-size: 14.5px; line-height: 1.75; color: var(--text); }
.message.user .msg-text { background: var(--user-bg); border: 1px solid rgba(255,140,0,0.35); border-radius: 12px 12px 2px 12px; padding: 12px 16px; display: inline-block; max-width: 85%; float: right; color: #ff9500; }
.msg-actions { display: flex; gap: 4px; margin-top: 10px; opacity: 0; transition: opacity 0.15s; }
.message:hover .msg-actions { opacity: 1; }
.msg-action-btn { display: flex; align-items: center; gap: 5px; padding: 4px 8px; border-radius: 5px; background: none; border: none; font-size: 11px; color: var(--text-3); cursor: pointer; font-family: 'Geist', sans-serif; transition: all 0.15s; }
.msg-action-btn:hover { background: var(--surface); color: var(--text-2); }
.msg-action-btn svg { width: 12px; height: 12px; }

/* ── Thinking ── */
.thinking-row { display: flex; gap: 16px; padding: 20px 0; animation: fadeUp 0.2s ease forwards; opacity: 0; }
.thinking-body { display: flex; flex-direction: column; gap: 10px; padding-top: 4px; }
.thinking-label { font-size: 11px; color: var(--text-3); letter-spacing: 0.08em; text-transform: uppercase; animation: labelPulse 1.8s ease infinite; }
.orbs { display: flex; gap: 7px; align-items: center; }
.orb { width: 9px; height: 9px; border-radius: 50%; animation: orbFloat 1.5s ease infinite; }
.orb:nth-child(1){background:#00ff87;animation-delay:0s}
.orb:nth-child(2){background:#60efff;animation-delay:0.18s}
.orb:nth-child(3){background:#a78bfa;animation-delay:0.36s}
.orb:nth-child(4){background:#f472b6;animation-delay:0.54s}
.orb:nth-child(5){background:#00d4ff;animation-delay:0.72s}
.thinking-bar-wrap { width: 160px; height: 3px; background: var(--border); border-radius: 2px; overflow: hidden; }
.thinking-bar { height: 100%; width: 35%; border-radius: 2px; background: linear-gradient(90deg,#00ff87,#60efff,#a78bfa,#f472b6); animation: scanBar 1.6s ease infinite; }

/* ── Input ── */
.input-wrapper { padding: 16px 24px 20px; flex-shrink: 0; }
.error-banner { max-width: 720px; margin: 0 auto 12px; background: rgba(255,80,80,0.08); border: 1px solid rgba(255,80,80,0.2); border-radius: 9px; padding: 10px 14px; font-size: 12.5px; color: #ff8080; display: none; }
.input-gradient-wrap { max-width: 720px; margin: 0 auto; position: relative; border-radius: 16px; padding: 2px; animation: auroraShift 8s linear infinite; }
@keyframes auroraShift {
  0%  {background:linear-gradient(0deg,  #00ff87,#60efff,#a78bfa,#f472b6,#00d4ff);box-shadow:0 0 24px rgba(0,255,135,.3),0 0 48px rgba(96,239,255,.1)}
  12% {background:linear-gradient(45deg, #60efff,#a78bfa,#f472b6,#ff6b9d,#60efff);box-shadow:0 0 24px rgba(96,239,255,.35),0 0 48px rgba(167,139,250,.15)}
  25% {background:linear-gradient(90deg, #a78bfa,#f472b6,#ff6b9d,#00d4ff,#a78bfa);box-shadow:0 0 24px rgba(167,139,250,.4),0 0 48px rgba(244,114,182,.15)}
  37% {background:linear-gradient(135deg,#f472b6,#ff6b9d,#00d4ff,#00ff87,#f472b6);box-shadow:0 0 24px rgba(244,114,182,.35),0 0 48px rgba(0,212,255,.15)}
  50% {background:linear-gradient(180deg,#00d4ff,#00ff87,#60efff,#a78bfa,#00d4ff);box-shadow:0 0 24px rgba(0,212,255,.3),0 0 48px rgba(0,255,135,.1)}
  62% {background:linear-gradient(225deg,#00ff87,#60efff,#a78bfa,#f472b6,#00ff87);box-shadow:0 0 24px rgba(0,255,135,.35),0 0 48px rgba(96,239,255,.15)}
  75% {background:linear-gradient(270deg,#60efff,#a78bfa,#f472b6,#ff6b9d,#60efff);box-shadow:0 0 28px rgba(96,239,255,.4),0 0 56px rgba(167,139,250,.2)}
  87% {background:linear-gradient(315deg,#a78bfa,#f472b6,#00d4ff,#00ff87,#a78bfa);box-shadow:0 0 24px rgba(167,139,250,.35),0 0 48px rgba(244,114,182,.15)}
  100%{background:linear-gradient(360deg,#00ff87,#60efff,#a78bfa,#f472b6,#00d4ff);box-shadow:0 0 24px rgba(0,255,135,.3),0 0 48px rgba(96,239,255,.1)}
}
.input-gradient-wrap:focus-within { animation: auroraFast 3s linear infinite; }
@keyframes auroraFast {
  0%  {background:linear-gradient(0deg,  #00ff87,#60efff,#a78bfa,#f472b6,#00d4ff);box-shadow:0 0 36px rgba(0,255,135,.55),0 0 72px rgba(96,239,255,.28)}
  25% {background:linear-gradient(90deg, #a78bfa,#f472b6,#ff6b9d,#00d4ff,#a78bfa);box-shadow:0 0 36px rgba(167,139,250,.65),0 0 72px rgba(244,114,182,.28)}
  50% {background:linear-gradient(180deg,#00d4ff,#00ff87,#60efff,#a78bfa,#00d4ff);box-shadow:0 0 36px rgba(0,212,255,.55),0 0 72px rgba(0,255,135,.28)}
  75% {background:linear-gradient(270deg,#60efff,#a78bfa,#f472b6,#ff6b9d,#60efff);box-shadow:0 0 42px rgba(96,239,255,.65),0 0 84px rgba(167,139,250,.32)}
  100%{background:linear-gradient(360deg,#00ff87,#60efff,#a78bfa,#f472b6,#00d4ff);box-shadow:0 0 36px rgba(0,255,135,.55),0 0 72px rgba(96,239,255,.28)}
}
.input-box { background: var(--bg); border-radius: 14px; padding: 14px 16px; display: flex; align-items: flex-end; gap: 10px; }
.input-left { flex: 1; display: flex; flex-direction: column; gap: 10px; }
textarea { background: none; border: none; outline: none; color: var(--text); font-family: 'Geist', sans-serif; font-size: 14.5px; line-height: 1.6; resize: none; max-height: 160px; min-height: 24px; width: 100%; }
textarea::placeholder { color: var(--text-3); }
.input-bottom { display: flex; align-items: center; justify-content: flex-end; }
.send-btn { width: 34px; height: 34px; border-radius: 8px; background: var(--accent); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; flex-shrink: 0; }
.send-btn:hover:not(:disabled) { background: #cc7000; transform: scale(1.05); }
.send-btn:active:not(:disabled) { transform: scale(0.94); }
.send-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.send-btn svg { width: 15px; height: 15px; fill: #0d0d0d; }
.input-hint { text-align: center; font-size: 11px; color: var(--text-3); margin-top: 10px; }
.menu-btn { display: none; width: 34px; height: 34px; align-items: center; justify-content: center; border-radius: 8px; border: 1px solid var(--border); background: var(--surface); color: var(--text-2); cursor: pointer; flex-shrink: 0; }
.menu-btn svg { width: 16px; height: 16px; }
.sidebar-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 20; backdrop-filter: blur(2px); }
.sidebar-overlay.active { display: block; }

/* ── Settings ── */
.settings-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(12px); z-index: 200; display: none; align-items: center; justify-content: center; padding: 20px; }
.settings-overlay.open { display: flex; animation: fadeIn 0.2s ease; }
.settings-modal { background: var(--sidebar); border: 1px solid var(--border-light); border-radius: 24px; width: 100%; max-width: 600px; max-height: 90vh; display: flex; flex-direction: column; animation: scaleIn 0.2s ease; overflow: hidden; }
.settings-header { display: flex; align-items: center; justify-content: space-between; padding: 28px 32px; border-bottom: 1px solid var(--border); flex-shrink: 0; }
.settings-title { font-family: 'Instrument Serif', serif; font-size: 28px; }
.settings-close { width: 36px; height: 36px; border-radius: 9px; border: 1px solid var(--border-light); background: var(--surface); color: var(--text-2); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
.settings-close:hover { background: var(--surface2); color: var(--text); }
.settings-close svg { width: 15px; height: 15px; }
.settings-body { padding: 32px; overflow-y: auto; display: flex; flex-direction: column; gap: 32px; flex: 1; }
.settings-body::-webkit-scrollbar { width: 4px; }
.settings-body::-webkit-scrollbar-thumb { background: var(--border-light); border-radius: 2px; }
.settings-section { display: flex; flex-direction: column; gap: 12px; }
.settings-section-label { font-size: 11px; font-weight: 600; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.12em; }
.credits-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 32px; text-align: center; position: relative; overflow: hidden; }
.credits-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg,rgba(255,140,0,0.07),transparent 60%); pointer-events: none; }
.credits-logo { width: 64px; height: 64px; border-radius: 18px; background: var(--accent); display: flex; align-items: center; justify-content: center; margin: 0 auto 18px; box-shadow: 0 4px 28px rgba(255,140,0,0.35); animation: logoFloat 3s ease infinite; }
.credits-name { font-family: 'Instrument Serif', serif; font-size: 28px; margin-bottom: 8px; }
.credits-made { font-size: 13px; color: var(--text-2); margin-bottom: 20px; }
.credits-badge { display: inline-flex; align-items: center; gap: 10px; background: rgba(255,140,0,0.1); border: 1px solid rgba(255,140,0,0.25); border-radius: 100px; padding: 10px 22px; font-size: 13px; color: var(--accent); font-weight: 500; text-decoration: none; transition: all 0.2s; }
.credits-badge:hover { background: rgba(255,140,0,0.18); border-color: rgba(255,140,0,0.5); transform: scale(1.03); box-shadow: 0 4px 24px rgba(255,140,0,0.2); }
.settings-info-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; }
.settings-info-label { font-size: 14px; color: var(--text-2); }
.settings-info-value { font-size: 13px; color: var(--text-3); font-family: 'Geist Mono', monospace; }
.color-picker-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; }
.color-picker-label { font-size: 14px; color: var(--text-2); }
.color-picker-right { display: flex; align-items: center; gap: 12px; }
.color-presets { display: flex; gap: 7px; }
.color-preset { width: 22px; height: 22px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; transition: all 0.15s; flex-shrink: 0; }
.color-preset:hover,.color-preset.active { border-color: var(--text); transform: scale(1.15); }
.color-swatch { width: 32px; height: 32px; border-radius: 8px; cursor: pointer; border: 2px solid var(--border-light); overflow: hidden; position: relative; }
.color-swatch input[type="color"] { position: absolute; inset: -4px; width: calc(100%+8px); height: calc(100%+8px); border: none; cursor: pointer; opacity: 0; }
.color-swatch-preview { position: absolute; inset: 0; border-radius: 6px; pointer-events: none; }
.toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; }
.toggle-label { font-size: 14px; color: var(--text-2); }
.toggle { position: relative; width: 42px; height: 24px; }
.toggle input { opacity: 0; width: 0; height: 0; }
.toggle-slider { position: absolute; inset: 0; background: var(--border-light); border-radius: 24px; cursor: pointer; transition: 0.2s; }
.toggle-slider:before { content: ''; position: absolute; width: 18px; height: 18px; left: 3px; bottom: 3px; background: white; border-radius: 50%; transition: 0.2s; }
.toggle input:checked + .toggle-slider { background: var(--accent); }
.toggle input:checked + .toggle-slider:before { transform: translateX(18px); }

/* ── Password ── */
.pw-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.9); backdrop-filter: blur(16px); z-index: 250; display: none; align-items: center; justify-content: center; }
.pw-overlay.open { display: flex; animation: fadeIn 0.2s ease; }
.pw-box { background: var(--sidebar); border: 1px solid var(--border-light); border-radius: 18px; padding: 32px; width: 100%; max-width: 340px; text-align: center; animation: scaleIn 0.2s ease; }
.pw-title { font-family: 'Instrument Serif', serif; font-size: 22px; margin-bottom: 8px; }
.pw-sub { font-size: 13px; color: var(--text-2); margin-bottom: 22px; }
.pw-input { width: 100%; background: var(--surface); border: 1px solid var(--border-light); border-radius: 10px; padding: 11px 16px; color: var(--text); font-family: 'Geist Mono', monospace; font-size: 14px; outline: none; text-align: center; letter-spacing: 0.1em; transition: border-color 0.15s; }
.pw-input:focus { border-color: var(--accent-border); }
.pw-input.error { border-color: rgba(255,80,80,0.5); animation: shake 0.3s ease; }
.pw-btn { width: 100%; margin-top: 12px; padding: 11px; background: var(--accent); border: none; border-radius: 10px; color: #0d0d0d; font-family: 'Geist', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.15s; }
.pw-btn:hover { background: #cc7000; }
.pw-cancel { margin-top: 10px; font-size: 12px; color: var(--text-3); cursor: pointer; display: block; transition: color 0.15s; }
.pw-cancel:hover { color: var(--text-2); }

/* ── Admin ── */
.admin-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.9); backdrop-filter: blur(16px); z-index: 300; display: none; align-items: center; justify-content: center; padding: 20px; }
.admin-overlay.open { display: flex; animation: fadeIn 0.2s ease; }
.admin-modal { background: var(--sidebar); border: 1px solid var(--border-light); border-radius: 24px; width: 100%; max-width: 680px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; animation: scaleIn 0.2s ease; }
.admin-header { display: flex; align-items: center; justify-content: space-between; padding: 24px 28px; border-bottom: 1px solid var(--border); flex-shrink: 0; }
.admin-title { font-family: 'Instrument Serif', serif; font-size: 24px; display: flex; align-items: center; gap: 10px; }
.admin-badge { font-size: 10px; font-weight: 600; background: rgba(255,140,0,0.15); border: 1px solid rgba(255,140,0,0.3); color: var(--accent); border-radius: 6px; padding: 3px 8px; letter-spacing: 0.08em; text-transform: uppercase; font-family: 'Geist', sans-serif; }
.live-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 10px; color: #4ade80; background: rgba(74,222,128,0.08); border: 1px solid rgba(74,222,128,0.2); border-radius: 6px; padding: 2px 8px; }
.live-dot { width: 5px; height: 5px; border-radius: 50%; background: #4ade80; animation: liveBlink 1s ease infinite; }
.admin-close { width: 34px; height: 34px; border-radius: 9px; border: 1px solid var(--border-light); background: var(--surface); color: var(--text-2); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
.admin-close:hover { background: var(--surface2); color: var(--text); }
.admin-close svg { width: 14px; height: 14px; }
.admin-body { padding: 24px 28px; overflow-y: auto; display: flex; flex-direction: column; gap: 26px; flex: 1; }
.admin-body::-webkit-scrollbar { width: 4px; }
.admin-body::-webkit-scrollbar-thumb { background: var(--border-light); border-radius: 2px; }
.admin-section-label { font-size: 10px; font-weight: 600; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px; }
.admin-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
.admin-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.admin-stat { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 16px 18px; transition: transform 0.2s; cursor: default; }
.admin-stat:hover { transform: translateY(-2px); }
.admin-stat-value { font-size: 28px; font-family: 'Instrument Serif', serif; color: var(--text); line-height: 1; margin-bottom: 4px; }
.admin-stat-label { font-size: 10px; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.08em; }
.admin-stat.accent { border-color:var(--accent-border);background:var(--accent-dim); }
.admin-stat.accent .admin-stat-value { color:var(--accent); }
.admin-stat.green  { border-color:rgba(74,222,128,.25);background:rgba(74,222,128,.06); }
.admin-stat.green  .admin-stat-value { color:#4ade80; }
.admin-stat.blue   { border-color:rgba(96,239,255,.25);background:rgba(96,239,255,.06); }
.admin-stat.blue   .admin-stat-value { color:#60efff; }
.admin-stat.purple { border-color:rgba(167,139,250,.25);background:rgba(167,139,250,.06); }
.admin-stat.purple .admin-stat-value { color:#a78bfa; }
.admin-row { display: flex; align-items: center; justify-content: space-between; padding: 11px 14px; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; margin-top: 6px; }
.admin-row-label { font-size: 13px; color: var(--text-2); }
.admin-row-value { font-size: 12px; color: var(--text-3); font-family: 'Geist Mono', monospace; }
.admin-row-value.green  { color: #4ade80; }
.admin-row-value.yellow { color: #facc15; }
.admin-row-value.blue   { color: #60efff; }
.admin-row-value.red    { color: #f87171; }
.chart-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 18px 20px; }
.chart-title { font-size: 11px; font-weight: 600; color: var(--text-3); letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 16px; }
.bar-chart { display: flex; align-items: flex-end; gap: 5px; height: 90px; }
.bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 5px; height: 100%; justify-content: flex-end; }
.bar { width: 100%; border-radius: 4px 4px 0 0; min-height: 2px; transition: opacity 0.15s, transform 0.15s; }
.bar:hover { opacity: 0.75; transform: scaleY(1.04); transform-origin: bottom; }
.bar-label { font-size: 9px; color: var(--text-3); }
.line-chart-svg { width: 100%; height: 90px; }
.chart-x-labels { display: flex; justify-content: space-between; margin-top: 8px; }
.chart-x-label { font-size: 9px; color: var(--text-3); }
.query-bar-wrap { display: flex; align-items: center; gap: 10px; min-width: 120px; }
.query-bar-bg { flex: 1; height: 4px; background: var(--border); border-radius: 2px; overflow: hidden; }
.query-bar-fill { height: 100%; border-radius: 2px; background: linear-gradient(90deg,#a78bfa,#60efff); transition: width 0.8s ease; }
.mini-sparkline { display: flex; align-items: flex-end; gap: 3px; height: 28px; }
.mini-bar { width: 5px; border-radius: 2px 2px 0 0; background: linear-gradient(to top,#a78bfa,#60efff); animation: miniBarPop 0.4s ease forwards; }
.donut-wrap { display: flex; align-items: center; gap: 20px; }
.donut-labels { display: flex; flex-direction: column; gap: 8px; flex: 1; }
.donut-label-row { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-2); }
.donut-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }

@media (max-width: 700px) {
  .menu-btn { display: flex; }
  .sidebar { position: fixed; top:0; left:0; bottom:0; z-index: 50; transform: translateX(-100%); width: 280px; }
  .sidebar.open { transform: translateX(0); }
  .topbar { padding: 12px 16px; }
  .chat-inner { padding: 20px 16px; }
  .welcome h1 { font-size: 26px; }
  .input-wrapper { padding: 10px 12px 16px; }
  .input-box { padding: 10px 12px; }
  .msg-avatar { width: 28px; height: 28px; }
  .message { gap: 10px; padding: 16px 0; }
  .msg-actions { opacity: 1; }
  .admin-grid-3 { grid-template-columns: 1fr 1fr; }
  .active-users-pill .online-label { display: none; }
  .warn-box { padding: 36px 24px; }
}
</style>
</head>
<body>

<!-- Warning Screen -->
<div id="warningScreen">
  <div class="warn-box">
    <div class="warn-logo">
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#0d0d0d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="12,2 22,7 12,12 2,7"/>
        <polyline points="2,12 12,17 22,12"/>
        <polyline points="2,17 12,22 22,17"/>
      </svg>
    </div>
    <div class="warn-title">Before you continue</div>
    <div class="warn-body">
      By pressing <strong>Agree</strong>, you confirm that you are solely responsible and accountable for everything you do with Meridian. Use it wisely.
    </div>
    <div class="warn-divider"></div>
    <div class="warn-fine">
      Meridian is an AI assistant built by The Noah Black Corporation.<br>
      Responses may not always be accurate. Do not rely on Meridian for critical decisions.
    </div>
    <button class="warn-btn" onclick="agreeAndEnter()">I Agree — Enter Meridian</button>
    <span class="warn-decline" onclick="window.location.href='about:blank'">Decline</span>
  </div>
</div>

<!-- App Shell -->
<div id="appShell">
  <div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>
  <div class="layout">

    <aside class="sidebar" id="sidebar">
      <div class="sidebar-logo">
        <div class="sidebar-logo-left">
          <div class="logo-mark">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0d0d0d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12,2 22,7 12,12 2,7"/>
              <polyline points="2,12 12,17 22,12"/>
              <polyline points="2,17 12,22 22,17"/>
            </svg>
          </div>
          <span class="logo-name">Meridian</span>
        </div>
        <button class="sidebar-collapse-btn" onclick="closeSidebar()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
      </div>
      <button class="new-chat-btn" onclick="newChat()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        New conversation
      </button>
      <div class="history-header" onclick="toggleHistory()">
        <span class="sidebar-section-label">Recent</span>
        <div class="history-toggle-btn" id="historyToggleBtn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </div>
      <div class="chat-history-list" id="chatHistoryList">
        <div id="chatHistory"></div>
      </div>
      <div class="sidebar-footer">
        <button class="sidebar-footer-btn" onclick="openSettings()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
          Settings
        </button>
      </div>
    </aside>

    <main class="main">
      <div class="topbar">
        <button class="menu-btn" onclick="openSidebar()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <div class="topbar-right">
          <div class="active-users-pill">
            <div class="active-dot high" id="activeDot"></div>
            <span id="activeUsersCount">—</span>
            <span class="online-label" style="font-size:12px;color:var(--text-3)">online</span>
          </div>
          <div class="model-pill">
            <div class="model-dot"></div>
            Llama 3.1 · 8B
          </div>
        </div>
      </div>
      <div class="chat-scroll" id="chatScroll">
        <div class="chat-inner" id="chatInner"></div>
      </div>
      <div class="input-wrapper">
        <div id="errorBanner" class="error-banner"></div>
        <div class="input-gradient-wrap">
          <div class="input-box">
            <div class="input-left">
              <textarea id="userInput" placeholder="Message Meridian..." rows="1" onkeydown="handleKey(event)" oninput="autoResize(this)"></textarea>
              <div class="input-bottom">
                <button class="send-btn" id="sendBtn" onclick="sendMessage()">
                  <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="input-hint">Meridian can make mistakes · Powered by Groq</div>
      </div>
    </main>

  </div>
</div>

<!-- Password -->
<div class="pw-overlay" id="pwOverlay">
  <div class="pw-box">
    <div class="pw-title">Admin Access</div>
    <div class="pw-sub">Enter password to continue</div>
    <input class="pw-input" id="pwInput" type="password" placeholder="••••••••••••••••" onkeydown="if(event.key==='Enter')checkPassword()">
    <button class="pw-btn" onclick="checkPassword()">Unlock</button>
    <span class="pw-cancel" onclick="closePw()">Cancel</span>
  </div>
</div>

<!-- Admin -->
<div class="admin-overlay" id="adminOverlay" onclick="closeAdminOnBg(event)">
  <div class="admin-modal">
    <div class="admin-header">
      <div class="admin-title">
        Dashboard <span class="admin-badge">Admin</span>
        <span class="live-badge"><span class="live-dot"></span>LIVE</span>
      </div>
      <button class="admin-close" onclick="closeAdmin()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="admin-body" id="adminBody"></div>
  </div>
</div>

<!-- Settings -->
<div class="settings-overlay" id="settingsOverlay" onclick="closeSettingsOnBg(event)">
  <div class="settings-modal">
    <div class="settings-header">
      <div class="settings-title">Settings</div>
      <button class="settings-close" onclick="closeSettings()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="settings-body">
      <div class="settings-section">
        <div class="settings-section-label">Appearance</div>
        <div class="color-picker-row">
          <span class="color-picker-label">Background color</span>
          <div class="color-picker-right">
            <div class="color-presets">
              <div class="color-preset active" style="background:#0d0d0d" onclick="setBg('#0d0d0d',this)"></div>
              <div class="color-preset" style="background:#0a0f1e" onclick="setBg('#0a0f1e',this)"></div>
              <div class="color-preset" style="background:#0f0a1e" onclick="setBg('#0f0a1e',this)"></div>
              <div class="color-preset" style="background:#0a1a0f" onclick="setBg('#0a1a0f',this)"></div>
              <div class="color-preset" style="background:#1a0a0a" onclick="setBg('#1a0a0a',this)"></div>
              <div class="color-preset" style="background:#0e1628" onclick="setBg('#0e1628',this)"></div>
            </div>
            <div class="color-swatch">
              <input type="color" id="customBgColor" value="#0d0d0d" oninput="setBgCustom(this.value)">
              <div class="color-swatch-preview" id="customSwatchPreview" style="background:#0d0d0d"></div>
            </div>
          </div>
        </div>
        <div class="toggle-row">
          <span class="toggle-label">Keyboard sounds</span>
          <label class="toggle">
            <input type="checkbox" id="soundToggle" checked onchange="toggleSound(this.checked)">
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>
      <div class="settings-section">
        <div class="settings-section-label">Credits</div>
        <div class="credits-card">
          <div class="credits-logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0d0d0d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12,2 22,7 12,12 2,7"/>
              <polyline points="2,12 12,17 22,12"/>
              <polyline points="2,17 12,22 22,17"/>
            </svg>
          </div>
          <div class="credits-name">Meridian</div>
          <div class="credits-made">Designed, built, and owned by</div>
          <a class="credits-badge" href="https://sites.google.com/alpinesd.org/tres-bros/home" target="_blank" rel="noopener">
            <svg width="28" height="28" viewBox="0 0 90 100" fill="none">
              <rect x="3" y="3" width="84" height="94" rx="14" stroke="currentColor" stroke-width="5.5"/>
              <path d="M12 20 L12 52 M12 20 L24 52 M24 20 L24 52" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M31 20 L31 52 M31 20 L42 20 Q50 20 50 30 Q50 37 31 37 M31 37 L43 37 Q52 37 52 44 Q52 53 31 52" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M72 26 Q62 18 56 30 Q51 42 58 51 Q65 60 74 54" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
              <path d="M18 62 Q18 76 11 76 Q6 76 6 70" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
              <line x1="6" y1="86" x2="76" y2="86" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
            </svg>
            ✦ The Noah Black Corporation
          </a>
        </div>
      </div>
      <div class="settings-section">
        <div class="settings-section-label">About</div>
        <div class="settings-info-row"><span class="settings-info-label">Model</span><span class="settings-info-value">llama-3.1-8b-instant</span></div>
        <div class="settings-info-row" style="margin-top:8px"><span class="settings-info-label">Powered by</span><span class="settings-info-value">Groq</span></div>
        <div class="settings-info-row" style="margin-top:8px"><span class="settings-info-label">Version</span><span class="settings-info-value">1.0.0</span></div>
      </div>
    </div>
  </div>
</div>

<script>
// ── Constants ──
const LOGO = `<svg viewBox="0 0 24 24" fill="white" width="16" height="16"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5-4-2-6 3-6-3z"/><path d="M2 12l10 5 10-5-4-2-6 3-6-3z"/></svg>`;
const GREETING = `Salutations mister, I'm Meridian — a smart AI assistant for whatever. I don't really care, ask away.`;

// ── State ──
let messages = [], isLoading = false, soundEnabled = true;
let currentChatId = null, historyOpen = true;
const MAX_CHATS = 3;

// ── Warning screen ──
function agreeAndEnter() {
  const ws = document.getElementById('warningScreen');
  ws.style.opacity = '0';
  setTimeout(() => {
    ws.style.display = 'none';
    const app = document.getElementById('appShell');
    app.classList.add('visible');
    bootApp();
  }, 500);
}

function bootApp() {
  // restore bg
  const savedBg = localStorage.getItem('meridian-bg');
  if (savedBg) {
    document.documentElement.style.setProperty('--bg', savedBg);
    document.getElementById('customBgColor').value = savedBg;
    document.getElementById('customSwatchPreview').style.background = savedBg;
  }
  // track session
  const s = getStats();
  s.totalSessions = (s.totalSessions || 0) + 1;
  if (!s.firstSeen) s.firstSeen = new Date().toISOString();
  localStorage.setItem('meridian-stats', JSON.stringify(s));
  // start
  currentChatId = genId();
  renderHistory();
  startActiveUsers();
  // show greeting
  const inner = document.getElementById('chatInner');
  inner.innerHTML = '';
  const el = buildMsgEl('ai', GREETING);
  el.style.animation = 'none';
  el.style.opacity = '1';
  inner.appendChild(el);
  messages = [{ role: 'assistant', content: GREETING }];
}

// ── Active users ──
function rnd(a,b){return Math.floor(Math.random()*(b-a+1))+a;}
let activeUsers = rnd(3,40);
function startActiveUsers(){
  tick();
  function tick(){
    if(Math.random()<0.25) activeUsers=Math.max(1,Math.min(4,activeUsers+rnd(-1,2)));
    else activeUsers=Math.max(1,Math.min(60,activeUsers+rnd(-3,6)));
    const el=document.getElementById('activeUsersCount');
    const dot=document.getElementById('activeDot');
    if(el) el.textContent=activeUsers;
    if(dot){
      dot.className='active-dot';
      dot.classList.add(activeUsers<=4?'low':activeUsers<=15?'mid':'high');
    }
    setTimeout(tick, rnd(5000,12000));
  }
}

// ── Traffic generators ──
function rndArr(base,spread){return base.map(v=>v+rnd(-spread,spread));}
function genDaily(){const d=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],b=[420,380,510,470,610,290,210];return d.map((l,i)=>({label:l,value:b[i]+rnd(-50,50)}));}
function gen30Day(){let v=rnd(150,400),a=[];for(let i=0;i<30;i++){v=Math.max(20,v+rnd(-50,70));a.push(v);}return a;}
function genHourly(){const h=['12a','3a','6a','9a','12p','3p','6p','9p'],b=[8,4,11,48,95,118,82,58];return h.map((l,i)=>({label:l,value:b[i]+rnd(-12,18)}));}
function genWeekly(){const w=['W1','W2','W3','W4','W5','W6','W7','W8'],b=[1200,980,1450,1380,1720,900,1100,1600];return w.map((l,i)=>({label:l,value:b[i]+rnd(-100,150)}));}
function genDevices(){return[{label:'Mobile',pct:52,color:'#a78bfa'},{label:'Desktop',pct:35,color:'#60efff'},{label:'Tablet',pct:13,color:'#f472b6'}];}
function genCountries(){return[{q:'United States',pct:38},{q:'United Kingdom',pct:14},{q:'Canada',pct:11},{q:'Australia',pct:8},{q:'Germany',pct:6}];}
function genQueries(){return[{q:'Business ideas',pct:18},{q:'Write an email',pct:14},{q:'Explain concept',pct:12},{q:'Summarize text',pct:9},{q:'Code help',pct:8}];}
function genMiniSpark(){let v=rnd(20,60),a=[];for(let i=0;i<14;i++){v=Math.max(5,v+rnd(-15,20));a.push(v);}return a;}

// ── Storage helpers ──
function getChats(){try{return JSON.parse(localStorage.getItem('meridian-chats')||'[]');}catch{return[];}}
function saveChats(c){localStorage.setItem('meridian-chats',JSON.stringify(c));}
function getStats(){try{return JSON.parse(localStorage.getItem('meridian-stats')||'{}');}catch{return{};}}
function genId(){return Date.now().toString(36)+Math.random().toString(36).slice(2);}
function shortName(t){t=t.trim();return t.length<=32?t:t.slice(0,30).trim()+'…';}

function deleteChat(id,e){
  e.stopPropagation();
  const chats=getChats().filter(c=>c.id!==id);
  saveChats(chats);
  if(currentChatId===id) newChat();
  else renderHistory();
}
function renderHistory(){
  const chats=getChats(), el=document.getElementById('chatHistory');
  if(!el) return;
  if(!chats.length){el.innerHTML='<div style="padding:8px 10px;font-size:12px;color:var(--text-3)">No recent chats</div>';return;}
  el.innerHTML=chats.map(c=>`
    <div class="chat-history-item ${c.id===currentChatId?'active':''}" onclick="loadChat('${c.id}')">
      <span class="chat-item-name" title="${c.name}">${c.name}</span>
      <button class="chat-delete-btn" onclick="deleteChat('${c.id}',event)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
      </button>
    </div>`).join('');
  el.querySelectorAll('.chat-history-item').forEach(item=>{
    const btn=item.querySelector('.chat-delete-btn');
    item.addEventListener('mouseenter',()=>btn.style.display='flex');
    item.addEventListener('mouseleave',()=>btn.style.display='none');
  });
}
function saveCurrentChat(name){
  let chats=getChats();
  const i=chats.findIndex(c=>c.id===currentChatId);
  if(i>=0){chats[i].name=name;chats[i].messages=messages;chats[i].updated=Date.now();}
  else{chats.unshift({id:currentChatId,name,messages,updated:Date.now()});if(chats.length>MAX_CHATS)chats=chats.slice(0,MAX_CHATS);}
  saveChats(chats);renderHistory();
}
function loadChat(id){
  const chat=getChats().find(c=>c.id===id);
  if(!chat) return;
  currentChatId=id; messages=chat.messages||[];
  const inner=document.getElementById('chatInner');
  inner.innerHTML='';
  messages.forEach(m=>{
    const el=buildMsgEl(m.role==='user'?'user':'ai',m.content);
    el.style.animation='none'; el.style.opacity='1';
    inner.appendChild(el);
  });
  renderHistory(); closeSidebar();
}
function toggleHistory(){
  historyOpen=!historyOpen;
  document.getElementById('chatHistoryList').classList.toggle('collapsed',!historyOpen);
  document.getElementById('historyToggleBtn').classList.toggle('collapsed',!historyOpen);
}

// ── Usage tracking ──
function trackMsg(){
  const s=getStats();
  s.totalMessages=(s.totalMessages||0)+1;
  s.lastActive=new Date().toISOString();
  localStorage.setItem('meridian-stats',JSON.stringify(s));
}

// ── Audio ──
const audioCtx=new(window.AudioContext||window.webkitAudioContext)();
function playKeyClick(){
  if(!soundEnabled) return;
  try{
    const buf=audioCtx.createBuffer(1,audioCtx.sampleRate*0.04,audioCtx.sampleRate);
    const data=buf.getChannelData(0);
    for(let i=0;i<data.length;i++) data[i]=(Math.random()*2-1)*Math.pow(1-i/data.length,6);
    const src=audioCtx.createBufferSource(); src.buffer=buf;
    const gain=audioCtx.createGain(); gain.gain.setValueAtTime(0.18,audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+0.04);
    const filt=audioCtx.createBiquadFilter(); filt.type='bandpass'; filt.frequency.value=3200; filt.Q.value=0.8;
    src.connect(filt); filt.connect(gain); gain.connect(audioCtx.destination); src.start();
  }catch(e){}
}
document.getElementById('userInput').addEventListener('keydown',e=>{
  if(audioCtx.state==='suspended') audioCtx.resume();
  if(e.key!=='Enter'||e.shiftKey) playKeyClick();
});
function toggleSound(v){soundEnabled=v;}

// ── Background ──
function setBg(color,el){
  document.documentElement.style.setProperty('--bg',color);
  document.getElementById('customBgColor').value=color;
  document.getElementById('customSwatchPreview').style.background=color;
  document.querySelectorAll('.color-preset').forEach(p=>p.classList.remove('active'));
  if(el) el.classList.add('active');
  localStorage.setItem('meridian-bg',color);
}
function setBgCustom(color){
  document.documentElement.style.setProperty('--bg',color);
  document.getElementById('customSwatchPreview').style.background=color;
  document.querySelectorAll('.color-preset').forEach(p=>p.classList.remove('active'));
  localStorage.setItem('meridian-bg',color);
}

// ── Modals ──
function openSettings(){document.getElementById('settingsOverlay').classList.add('open');closeSidebar();}
function closeSettings(){document.getElementById('settingsOverlay').classList.remove('open');}
function closeSettingsOnBg(e){if(e.target===document.getElementById('settingsOverlay'))closeSettings();}
function openSidebar(){document.getElementById('sidebar').classList.add('open');document.getElementById('sidebarOverlay').classList.add('active');}
function closeSidebar(){document.getElementById('sidebar').classList.remove('open');document.getElementById('sidebarOverlay').classList.remove('active');}
function openPw(){document.getElementById('pwOverlay').classList.add('open');setTimeout(()=>document.getElementById('pwInput').focus(),100);}
function closePw(){document.getElementById('pwOverlay').classList.remove('open');document.getElementById('pwInput').value='';document.getElementById('pwInput').classList.remove('error');}
function checkPassword(){
  if(document.getElementById('pwInput').value.trim()==='oakcanyonisabum'){closePw();openAdmin();}
  else{const inp=document.getElementById('pwInput');inp.classList.add('error');setTimeout(()=>inp.classList.remove('error'),400);}
}
document.getElementById('userInput').addEventListener('input',function(){
  if(this.value.trim()==='oakcanyonisabum'){this.value='';openPw();}
});

// ── Admin charts ──
function buildBar(data,cf){
  const max=Math.max(...data.map(d=>d.value));
  return`<div class="bar-chart">${data.map((d,i)=>{
    const h=Math.max(4,Math.round((d.value/max)*86));
    return`<div class="bar-col"><div class="bar" style="height:${h}px;background:${cf(d.value,max)};animation:miniBarPop 0.4s ease ${i*0.05}s both" title="${d.value}"></div><div class="bar-label">${d.label}</div></div>`;
  }).join('')}</div>`;
}
function buildSparkline(vals){
  const W=580,H=90,P=6,max=Math.max(...vals),min=Math.min(...vals),range=max-min||1;
  const pts=vals.map((v,i)=>`${P+(i/(vals.length-1))*(W-P*2)},${P+(1-(v-min)/range)*(H-P*2)}`);
  const poly=pts.join(' '), fill=`${P},${H} ${poly} ${W-P},${H}`;
  return`<svg class="line-chart-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
    <defs>
      <linearGradient id="aG" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#00ff87"/><stop offset="33%" stop-color="#60efff"/><stop offset="66%" stop-color="#a78bfa"/><stop offset="100%" stop-color="#f472b6"/></linearGradient>
      <linearGradient id="aF" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#a78bfa" stop-opacity="0.25"/><stop offset="100%" stop-color="#a78bfa" stop-opacity="0"/></linearGradient>
    </defs>
    <polygon points="${fill}" fill="url(#aF)"/>
    <polyline points="${poly}" fill="none" stroke="url(#aG)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}
function buildMini(vals){
  const max=Math.max(...vals);
  return`<div class="mini-sparkline">${vals.map((v,i)=>`<div class="mini-bar" style="height:${Math.max(3,Math.round((v/max)*28))}px;animation-delay:${i*0.04}s"></div>`).join('')}</div>`;
}
function buildDonut(devices){
  const s=80,cx=40,cy=40,r=28,c=2*Math.PI*r;let off=0;
  return`<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">${devices.map(d=>{const dash=(d.pct/100)*c,gap=c-dash,sl=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${d.color}" stroke-width="12" stroke-dasharray="${dash} ${gap}" stroke-dashoffset="${-off}" transform="rotate(-90 ${cx} ${cy})" opacity="0.85"/>`;off+=dash;return sl;}).join('')}</svg>`;
}

function openAdmin(){
  const stats=getStats(), chats=getChats();
  const totalMsgs=stats.totalMessages||0, totalSessions=stats.totalSessions||0;
  const avgMsgs=totalSessions>0?(totalMsgs/totalSessions).toFixed(1):'0';
  const firstSeen=stats.firstSeen?new Date(stats.firstSeen).toLocaleDateString():'N/A';
  const lastActive=stats.lastActive?new Date(stats.lastActive).toLocaleString():'N/A';
  const daily=genDaily(), monthly=gen30Day(), hourly=genHourly(), weekly=genWeekly();
  const devices=genDevices(), countries=genCountries(), queries=genQueries();
  const totalVisits=daily.reduce((a,d)=>a+d.value,0);
  const peakDay=daily.reduce((a,d)=>d.value>a.value?d:a,daily[0]);
  const avgD=Math.round(totalVisits/7), bounce=rnd(28,52), avgSess=`${rnd(2,4)}m ${rnd(10,59)}s`;
  const bc=(v,m)=>{const t=v/m;return t>.75?'#00ff87':t>.5?'#60efff':t>.25?'#a78bfa':'#f472b6';};
  const hc=(v,m)=>{const t=v/m;return t>.7?'#f472b6':t>.4?'#a78bfa':'#60efff';};
  const wc=(v,m)=>{const t=v/m;return t>.7?'#00ff87':t>.4?'#60efff':'#a78bfa';};
  const chatRows=chats.length?chats.map((c,i)=>`<div class="admin-row"><span class="admin-row-label">${i+1}. ${c.name}</span><span class="admin-row-value">${new Date(c.updated).toLocaleDateString()}</span></div>`).join(''):'<div class="admin-row"><span class="admin-row-label" style="color:var(--text-3)">No chats yet</span></div>';
  const cRows=countries.map(c=>`<div class="admin-row"><span class="admin-row-label">${c.q}</span><div style="display:flex;align-items:center;gap:8px"><div style="width:80px;height:4px;background:var(--border);border-radius:2px;overflow:hidden"><div style="width:${c.pct*2.6}%;height:100%;background:linear-gradient(90deg,#60efff,#a78bfa);border-radius:2px"></div></div><span class="admin-row-value blue">${c.pct}%</span></div></div>`).join('');
  const qRows=queries.map(q=>`<div class="admin-row"><span class="admin-row-label">${q.q}</span><div class="query-bar-wrap"><div class="query-bar-bg"><div class="query-bar-fill" style="width:0%"></div></div><span class="admin-row-value">${q.pct}%</span></div></div>`).join('');

  document.getElementById('adminBody').innerHTML=`
    <div><div class="admin-section-label">Overview</div>
      <div class="admin-grid-3">
        <div class="admin-stat accent"><div class="admin-stat-value">${totalVisits.toLocaleString()}</div><div class="admin-stat-label">Total Visits</div></div>
        <div class="admin-stat green"><div class="admin-stat-value">${activeUsers}</div><div class="admin-stat-label">Active Now</div></div>
        <div class="admin-stat blue"><div class="admin-stat-value">${avgD.toLocaleString()}</div><div class="admin-stat-label">Avg Daily</div></div>
        <div class="admin-stat purple"><div class="admin-stat-value">${totalMsgs}</div><div class="admin-stat-label">Messages</div></div>
        <div class="admin-stat accent"><div class="admin-stat-value">${totalSessions}</div><div class="admin-stat-label">Sessions</div></div>
        <div class="admin-stat"><div class="admin-stat-value">${avgMsgs}</div><div class="admin-stat-label">Msgs/Session</div></div>
      </div>
    </div>
    <div><div class="admin-section-label">Engagement</div>
      <div class="admin-grid-3">
        <div class="admin-stat"><div class="admin-stat-value">${bounce}%</div><div class="admin-stat-label">Bounce Rate</div></div>
        <div class="admin-stat green"><div class="admin-stat-value">${avgSess}</div><div class="admin-stat-label">Avg Session</div></div>
        <div class="admin-stat blue"><div class="admin-stat-value">${peakDay.label}</div><div class="admin-stat-label">Peak Day</div></div>
      </div>
    </div>
    <div><div class="admin-section-label">Live</div>
      <div class="admin-grid-2">
        <div class="chart-wrap"><div class="chart-title">Requests — last 14 min</div>${buildMini(genMiniSpark())}</div>
        <div class="chart-wrap"><div class="chart-title">Response time (ms)</div>${buildMini(genMiniSpark().map(v=>Math.round(v*3+180)))}</div>
      </div>
    </div>
    <div><div class="admin-section-label">Daily Traffic</div><div class="chart-wrap"><div class="chart-title">Visits Per Day</div>${buildBar(daily,bc)}</div></div>
    <div><div class="admin-section-label">30-Day Trend</div>
      <div class="chart-wrap"><div class="chart-title">Last 30 Days</div>${buildSparkline(monthly)}
        <div class="chart-x-labels"><span class="chart-x-label">30d ago</span><span class="chart-x-label">20d ago</span><span class="chart-x-label">10d ago</span><span class="chart-x-label">Today</span></div>
      </div>
    </div>
    <div><div class="admin-section-label">8-Week Traffic</div><div class="chart-wrap"><div class="chart-title">Weekly Visits</div>${buildBar(weekly,wc)}</div></div>
    <div><div class="admin-section-label">By Hour</div><div class="chart-wrap"><div class="chart-title">Visits By Time of Day</div>${buildBar(hourly,hc)}</div></div>
    <div><div class="admin-section-label">Devices</div>
      <div class="chart-wrap"><div class="chart-title">Visitors By Device</div>
        <div class="donut-wrap">${buildDonut(devices)}<div class="donut-labels">${devices.map(d=>`<div class="donut-label-row"><div class="donut-dot" style="background:${d.color}"></div>${d.label} — ${d.pct}%</div>`).join('')}</div></div>
      </div>
    </div>
    <div><div class="admin-section-label">Top Countries</div>${cRows}</div>
    <div><div class="admin-section-label">Query Types</div>${qRows}</div>
    <div><div class="admin-section-label">Activity</div>
      <div class="admin-row"><span class="admin-row-label">First seen</span><span class="admin-row-value green">${firstSeen}</span></div>
      <div class="admin-row"><span class="admin-row-label">Last active</span><span class="admin-row-value yellow">${lastActive}</span></div>
      <div class="admin-row"><span class="admin-row-label">Background</span><span class="admin-row-value">${localStorage.getItem('meridian-bg')||'#0d0d0d'}</span></div>
      <div class="admin-row"><span class="admin-row-label">Storage</span><span class="admin-row-value">${(JSON.stringify(localStorage).length/1024).toFixed(1)} KB</span></div>
      <div class="admin-row"><span class="admin-row-label">Sound</span><span class="admin-row-value ${soundEnabled?'green':'red'}">${soundEnabled?'Enabled':'Disabled'}</span></div>
    </div>
    <div><div class="admin-section-label">Saved Chats (${chats.length}/${MAX_CHATS})</div>${chatRows}</div>`;

  document.getElementById('adminOverlay').classList.add('open');
  setTimeout(()=>{
    const fills=document.querySelectorAll('.query-bar-fill');
    const targets=['90%','70%','60%','45%','40%'];
    fills.forEach((b,i)=>setTimeout(()=>b.style.width=targets[i]||'30%',i*80));
  },150);
}
function closeAdmin(){document.getElementById('adminOverlay').classList.remove('open');}
function closeAdminOnBg(e){if(e.target===document.getElementById('adminOverlay'))closeAdmin();}

// ── Chat ──
function buildMsgEl(role, content){
  const div=document.createElement('div');
  div.className=`message ${role}`;
  if(role==='ai'){
    div.innerHTML=`
      <div class="msg-avatar ai">${LOGO}</div>
      <div class="msg-content">
        <div class="msg-name">Meridian</div>
        <div class="msg-text">${content.replace(/\n/g,'<br>')}</div>
        <div class="msg-actions">
          <button class="msg-action-btn" onclick="copyText(this)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            Copy
          </button>
        </div>
      </div>`;
  } else {
    div.innerHTML=`
      <div class="msg-avatar user">Y</div>
      <div class="msg-content">
        <div class="msg-name">You</div>
        <div class="msg-text">${content.replace(/\n/g,'<br>')}</div>
      </div>`;
  }
  return div;
}

function appendMsg(role, content){
  const inner=document.getElementById('chatInner');
  inner.appendChild(buildMsgEl(role, content));
  document.getElementById('chatScroll').scrollTop=99999;
}

function showThinking(){
  const div=document.createElement('div');
  div.className='thinking-row'; div.id='thinkingRow';
  div.innerHTML=`
    <div class="msg-avatar ai">${LOGO}</div>
    <div class="thinking-body">
      <div class="thinking-label">Thinking</div>
      <div class="orbs"><div class="orb"></div><div class="orb"></div><div class="orb"></div><div class="orb"></div><div class="orb"></div></div>
      <div class="thinking-bar-wrap"><div class="thinking-bar"></div></div>
    </div>`;
  document.getElementById('chatInner').appendChild(div);
  document.getElementById('chatScroll').scrollTop=99999;
}
function removeThinking(){const el=document.getElementById('thinkingRow');if(el)el.remove();}

function copyText(btn){
  const text=btn.closest('.msg-content').querySelector('.msg-text').innerText;
  navigator.clipboard.writeText(text).then(()=>{
    btn.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copied`;
    setTimeout(()=>{btn.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy`;},2000);
  });
}

function newChat(){
  currentChatId=genId();
  messages=[];
  const inner=document.getElementById('chatInner');
  inner.innerHTML='';
  const el=buildMsgEl('ai', GREETING);
  el.style.animation='none'; el.style.opacity='1';
  inner.appendChild(el);
  messages=[{role:'assistant', content: GREETING}];
  renderHistory();
  closeSidebar();
}

function autoResize(el){el.style.height='auto';el.style.height=Math.min(el.scrollHeight,160)+'px';}
function handleKey(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage();}}
function showError(msg){const el=document.getElementById('errorBanner');el.textContent=msg;el.style.display='block';setTimeout(()=>el.style.display='none',5000);}

async function sendMessage(){
  if(isLoading) return;
  const input=document.getElementById('userInput');
  const text=input.value.trim();
  if(!text) return;
  input.value=''; input.style.height='auto';
  isLoading=true; document.getElementById('sendBtn').disabled=true;
  appendMsg('user', text);
  messages.push({role:'user', content:text});
  const userMsgCount=messages.filter(m=>m.role==='user').length;
  if(userMsgCount===1) saveCurrentChat(shortName(text));
  trackMsg();
  showThinking();
  try{
    const res=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages})});
    const data=await res.json();
    removeThinking();
    if(data.error){showError(data.error);messages.pop();}
    else{
      messages.push({role:'assistant',content:data.reply});
      appendMsg('ai',data.reply);
      const firstName=messages.find(m=>m.role==='user');
      if(firstName) saveCurrentChat(shortName(firstName.content));
    }
  }catch(err){
    removeThinking();
    showError('Connection error. Please try again.');
    messages.pop();
  }
  isLoading=false;
  document.getElementById('sendBtn').disabled=false;
  input.focus();
}
</script>
</body>
</html>
