<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'
import { ref, onMounted, watch } from 'vue'

const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: ''
})
const toggleDark = useToggle(isDark)
const router = useRouter()
const isLoading = ref(false)

// 添加全局状态来跟踪当前路由
const currentRoute = ref(router.currentRoute.value.path)

// 获取页面切换动画名称
const getTransitionName = (route: any) => {
  // 根据路由路径决定动画类型
  if (route.path === '/') return 'fade'
  if (route.path.includes('chat')) return 'slide-left'
  return 'slide-up'
}

// 添加全局路由守卫
router.beforeEach((to, from, next) => {
  isLoading.value = true

  // 如果是从 ChatPDF 页面离开
  if (from.path === '/chat-pdf') {
    // 触发一个自定义事件，让 ChatPDF 组件知道要清理资源
    window.dispatchEvent(new CustomEvent('cleanupChatPDF'))
  }

  currentRoute.value = to.path
  next()
})

router.afterEach(() => {
  // 模拟加载时间
  setTimeout(() => {
    isLoading.value = false
  }, 300)
})

onMounted(() => {
  // 初始化时隐藏加载状态
  isLoading.value = false
  console.log('App mounted, isDark:', isDark.value)
  console.log('HTML class:', document.documentElement.className)
})

// 添加主题变化监听器用于调试
watch(() => isDark.value, (newValue) => {
  console.log('Theme changed to:', newValue ? 'dark' : 'light')
  console.log('HTML class after change:', document.documentElement.className)
}, { immediate: true })
</script>

<template>
  <div class="app">
    <!-- Background Elements -->
    <div class="bg-elements">
      <div class="bg-gradient"></div>
      <div class="bg-grid"></div>
      <div class="bg-orbs">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="navbar glass">
      <div class="nav-content">
        <router-link to="/" class="logo-container">
          <div class="logo-icon">
            <div class="logo-symbol">
              <div class="symbol-inner"></div>
            </div>
          </div>
          <div class="logo-text">
            <span class="logo-main gradient-text">Chat AI Hub</span>
            <span class="logo-sub">智能对话平台</span>
          </div>
        </router-link>

        <div class="nav-actions">
          <button @click="toggleDark()" class="theme-toggle btn-secondary">
            <MoonIcon v-if="isDark" class="icon" />
            <SunIcon v-else class="icon" />
            <span class="toggle-text">{{ isDark ? '深色' : '浅色' }}</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
      <router-view v-slot="{ Component, route }">
        <transition :name="getTransitionName(route)" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>

    <!-- Loading Overlay -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-text">加载中...</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.app {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

/* Background Elements */
.bg-elements {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}

.bg-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--gradient-primary);
  opacity: 0.03;

  html.dark & {
    opacity: 0.05;
  }
}

.bg-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.3;

  html.dark & {
    background-image:
      linear-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px),
      linear-gradient(90deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px);
    opacity: 0.1;
  }
}

.bg-orbs {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.1;
  animation: float 20s ease-in-out infinite;

  html.dark & {
    opacity: 0.05;
  }
}

.orb-1 {
  width: 300px;
  height: 300px;
  background: var(--gradient-primary);
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 200px;
  height: 200px;
  background: var(--gradient-secondary);
  top: 60%;
  right: 10%;
  animation-delay: -7s;
}

.orb-3 {
  width: 150px;
  height: 150px;
  background: var(--accent-500);
  bottom: 20%;
  left: 60%;
  animation-delay: -14s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-30px) rotate(120deg);
  }
  66% {
    transform: translateY(30px) rotate(240deg);
  }
}

/* Navigation */
.navbar {
  position: sticky;
  top: 0;
  z-index: var(--z-50);
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--glass-border);

  .nav-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 var(--space-6);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.logo-container {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  text-decoration: none;
  color: inherit;
  transition: var(--transition-all);

  &:hover {
    transform: translateY(-1px);
  }
}

.logo-icon {
  position: relative;
  width: 40px;
  height: 40px;
}

.logo-symbol {
  width: 100%;
  height: 100%;
  background: var(--gradient-primary);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--gradient-glass);
    border-radius: var(--radius-lg);
  }
}

.symbol-inner {
  width: 16px;
  height: 16px;
  background: white;
  border-radius: var(--radius-base);
  position: relative;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 4px;
    height: 4px;
    background: var(--primary-600);
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 6px;
    height: 6px;
    background: var(--secondary-500);
    border-radius: 50%;
  }
}

.logo-text {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.logo-main {
  font-size: var(--text-xl);
  font-weight: 700;
  line-height: var(--leading-none);
}

.logo-sub {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  font-weight: 500;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.theme-toggle {
  position: relative;
  overflow: hidden;

  .icon {
    width: 18px;
    height: 18px;
    transition: var(--transition-all);
  }

  .toggle-text {
    font-size: var(--text-sm);
    margin-left: var(--space-1);
  }

  &:hover .icon {
    transform: rotate(180deg);
  }
}

/* Main Content */
.main-content {
  flex: 1;
  position: relative;
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-50);
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.spinner-ring {
  width: 40px;
  height: 40px;
  border: 3px solid var(--glass-border);
  border-top: 3px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-text {
  color: var(--text-color);
  font-size: var(--text-sm);
  font-weight: 500;
}

/* Page Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-slow);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all var(--transition-slow);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all var(--transition-slow);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .navbar .nav-content {
    padding: 0 var(--space-4);
  }

  .logo-text .logo-sub {
    display: none;
  }

  .theme-toggle .toggle-text {
    display: none;
  }

  .bg-orbs {
    display: none; // 移动端隐藏装饰元素以提升性能
  }
}

@media (max-width: 480px) {
  .navbar .nav-content {
    padding: 0 var(--space-3);
  }

  .logo-main {
    font-size: var(--text-lg);
  }

  .logo-icon {
    width: 32px;
    height: 32px;
  }
}
</style>
