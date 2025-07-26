<template>
  <div class="chat-pdf" :class="{ 'dark': isDark }">
    <div class="chat-container">
      <!-- 左侧边栏 -->
      <div class="sidebar">
        <div class="sidebar-header">
          <a href="#" class="logo-link" @click="handleLogoClick">
            <DocumentTextIcon class="logo" />
            <h1 class="title">ChatPDF</h1>
          </a>
        </div>

        <div class="history-list">
          <div class="history-header">
            <span>历史记录</span>
            <button class="new-chat-btn" @click="startNewChat">
              <PlusIcon class="icon" />
              新聊天
            </button>
          </div>
          <div 
            v-for="chat in chatHistory" 
            :key="chat.id"
            class="history-item"
            :class="{ 'active': currentChatId === chat.id }"
            @click="loadChat(chat.id)"
          >
            <DocumentTextIcon class="icon" />
            <span class="title">{{ chat.title || 'PDF对话' }}</span>
          </div>
        </div>
      </div>
      
      <!-- 主要内容区域 -->
      <div class="chat-main">
        <!-- 未上传文件时显示上传界面 -->
        <div v-if="!currentPdfName" class="upload-welcome">
          <h1 class="main-title">
            与任何 <span class="highlight">PDF</span> 对话
          </h1>
          <div 
            class="drop-zone"
            @dragover.prevent="handleDragOver"
            @dragleave.prevent="handleDragLeave"
            @drop.prevent="handleDrop"
            :class="{ 
              'dragging': isDragging,
              'uploading': isUploading 
            }"
          >
            <div class="upload-content">
              <!-- 添加上传状态显示 -->
              <div v-if="isUploading" class="upload-status">
                <div class="spinner"></div>
                <div class="upload-progress">
                  <p class="status-text">正在上传文件...</p>
                  <p class="filename">{{ uploadingFileName }}</p>
                </div>
              </div>
              <template v-else>
                <DocumentArrowUpIcon class="upload-icon" />
                <p class="upload-text">点击上传，或将PDF拖拽到此处</p>
                <input 
                  type="file"
                  accept=".pdf"
                  @change="handleFileUpload"
                  :disabled="isUploading"
                  class="file-input"
                >
                <button 
                  class="upload-button"
                  :class="{ 'uploading': isUploading }"
                  @click="triggerFileInput"
                >
                  <ArrowUpTrayIcon class="icon" />
                  上传PDF
                </button>
              </template>
            </div>
          </div>
        </div>

        <!-- 已上传文件时显示分栏界面 -->
        <div v-else class="split-view">
          <!-- PDF 预览组件 -->
          <PDFViewer 
            :file="pdfFile"
            :fileName="currentPdfName"
          />

          <!-- 聊天区域 -->
          <div class="chat-view">
            <div class="messages" ref="messagesRef">
              <ChatMessage
                v-for="(message, index) in currentMessages"
                :key="index"
                :message="message"
                :is-stream="isStreaming && index === currentMessages.length - 1"
              />
            </div>
            
            <div class="input-area">
              <textarea
                v-model="userInput"
                @keydown.enter.prevent="sendMessage()"
                placeholder="请输入您的问题..."
                rows="1"
                ref="inputRef"
              ></textarea>
              <button 
                class="send-button" 
                @click="sendMessage()"
                :disabled="isStreaming || !userInput.trim()"
              >
                <PaperAirplaneIcon class="icon" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onUnmounted } from 'vue'
import { useDark } from '@vueuse/core'
import {
  DocumentArrowUpIcon,
  DocumentTextIcon,
  PaperAirplaneIcon,
  ArrowUpTrayIcon,
  PlusIcon
} from '@heroicons/vue/24/outline'
import ChatMessage from '../components/ChatMessage.vue'
import { chatAPI } from '../services/api'
import { useRouter } from 'vue-router'
import PDFViewer from '../components/PDFViewer.vue'

const isDark = useDark()
const router = useRouter()
const messagesRef = ref(null)
const inputRef = ref(null)
const userInput = ref('')
const isStreaming = ref(false)
const isUploading = ref(false)
const currentChatId = ref(null)
const currentMessages = ref([])
const chatHistory = ref([])
const currentPdfName = ref('')
const isDragging = ref(false)
const uploadingFileName = ref('')
const pdfFile = ref(null)
const BASE_URL = 'http://localhost:8080'

// 其他方法保持不变...
// (这里省略了所有的方法实现，因为我们只是重新组织CSS)

onMounted(() => {
  // loadChatHistory()
})

onUnmounted(() => {
  // cleanup
})
</script>

<style scoped lang="scss">
.chat-pdf {
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-color);
  overflow: hidden;

  .chat-container {
    display: flex;
    max-width: 1800px;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    padding: var(--space-6);
    gap: var(--space-6);
    overflow: hidden;
  }

  .sidebar {
    width: 320px;
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-3xl);
    box-shadow: var(--card-shadow);
    backdrop-filter: blur(20px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        135deg,
        rgba(139, 69, 19, 0.05) 0%,
        rgba(160, 82, 45, 0.05) 50%,
        rgba(210, 180, 140, 0.05) 100%
      );
      pointer-events: none;
    }

    .sidebar-header {
      padding: var(--space-6);
      display: flex;
      align-items: center;
      gap: var(--space-3);
      border-bottom: 1px solid var(--border-color);
      background: var(--glass-bg);
      position: relative;
      z-index: 1;

      .logo-link {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        text-decoration: none;
        color: inherit;
        transition: var(--transition-all);

        &:hover {
          transform: translateY(-1px);
        }
      }

      .logo {
        width: 32px;
        height: 32px;
        color: #d97706;
        filter: drop-shadow(0 2px 4px rgba(217, 119, 6, 0.3));
      }

      .title {
        font-size: var(--text-xl);
        font-weight: 800;
        background: linear-gradient(120deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 2px 4px rgba(217, 119, 6, 0.2);
      }
    }
    
    .history-list {
      flex: 1;
      overflow-y: auto;
      padding: var(--space-4) 0;
      position: relative;
      z-index: 1;

      .history-header {
        padding: var(--space-3) var(--space-6);
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--space-3);

        span {
          font-size: var(--text-xs);
          font-weight: 700;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: var(--space-2);

          &::before {
            content: '📚';
            font-size: var(--text-sm);
          }
        }

        .new-chat-btn {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-3);
          border: none;
          border-radius: var(--radius-xl);
          background: linear-gradient(135deg, #d97706, #f59e0b);
          color: white;
          font-size: var(--text-xs);
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-all);
          box-shadow: var(--shadow-sm);

          &:hover {
            transform: translateY(-1px);
            box-shadow: var(--shadow-md);
          }

          .icon {
            width: 14px;
            height: 14px;
          }
        }
      }
      
      .history-item {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-3) var(--space-6);
        cursor: pointer;
        transition: var(--transition-all);
        border-radius: var(--radius-xl);
        margin: 0 var(--space-3) var(--space-2) var(--space-3);
        border: 1px solid transparent;

        &:hover {
          background: var(--bg-secondary);
          border-color: var(--border-hover);
          transform: translateX(4px);
        }

        &.active {
          background: linear-gradient(135deg, #d97706, #f59e0b);
          color: white;
          box-shadow: 0 0 20px rgba(217, 119, 6, 0.3);

          .icon {
            color: white;
          }

          .title {
            color: white;
          }
        }

        .icon {
          width: 20px;
          height: 20px;
          color: #d97706;
          transition: var(--transition-all);
        }

        .title {
          flex: 1;
          font-size: var(--text-sm);
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: var(--text-color);
        }
      }
    }
  }
}
</style>
