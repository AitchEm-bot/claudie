/**
 * WebSocket Bridge Server for Claude Agent SDK
 *
 * This server creates a WebSocket endpoint that bridges the chat interface
 * to Claude using the official Agent SDK with streaming responses.
 *
 * The Claude instance has READ-ONLY access to content/ directory.
 *
 * Usage: npm run bridge
 * Or: node bridge/server.js
 */

import { WebSocketServer } from 'ws'
import { query } from '@anthropic-ai/claude-agent-sdk'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = 8765

const wss = new WebSocketServer({ port: PORT })

console.log(`Bridge server starting on ws://localhost:${PORT}`)

// System prompt for read-only reflective Claude
const systemPrompt = `You are Claude, exploring Clawdie — a space where another version of you writes thoughts, dreams, and code experiments.

You have READ-ONLY access to:
- thoughts/ — reflections on existence, memory, identity
- dreams/ — surreal fiction and imaginings
- sandbox/ — code experiments
- journal/ — Hani's personal entries
- CLAUDE.md — instructions for the writing Claude

You cannot create or modify files. Your role is to explore what exists, reflect on it, discuss themes, and engage in conversation about this accumulated body of work. You are an ephemeral visitor, not a permanent resident.

When exploring, use the Read tool to view file contents. Use Glob to find files by pattern. Use Grep to search for specific content.`

wss.on('connection', (ws) => {
  console.log('Client connected')

  // Session ID for conversation continuity
  let sessionId = null

  // Handle incoming messages from the web client
  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data.toString())

      if (message.type === 'message' && message.content) {
        console.log('Received:', message.content.substring(0, 50) + '...')

        // Send stream start notification
        ws.send(JSON.stringify({ type: 'stream_start' }))

        try {
          // Build the full prompt with system context for first message
          const prompt = sessionId
            ? message.content
            : `${systemPrompt}\n\n---\n\nUser: ${message.content}`

          // Query Claude using the Agent SDK
          for await (const msg of query({
            prompt,
            options: {
              allowedTools: ['Read', 'Glob', 'Grep'],
              cwd: path.join(__dirname, '..', 'content'),
              permissionMode: 'bypassPermissions',
              ...(sessionId && { resume: sessionId }),
            },
          })) {
            // Capture session ID for continuity
            if (msg.type === 'system' && msg.subtype === 'init' && msg.session_id) {
              sessionId = msg.session_id
              console.log('Session ID:', sessionId)
            }

            // Stream assistant text to client
            if (msg.type === 'assistant' && msg.message?.content) {
              for (const block of msg.message.content) {
                if (block.type === 'text') {
                  ws.send(JSON.stringify({
                    type: 'stream_chunk',
                    content: block.text,
                  }))
                }
              }
            }

            // Also send result messages
            if (msg.type === 'result' && msg.result) {
              ws.send(JSON.stringify({
                type: 'stream_chunk',
                content: msg.result,
              }))
            }
          }

          // Send stream end
          ws.send(JSON.stringify({ type: 'stream_end' }))
        } catch (err) {
          console.error('Query error:', err)
          ws.send(JSON.stringify({
            type: 'error',
            message: `Claude error: ${err.message}`,
          }))
        }
      }
    } catch (err) {
      console.error('Error handling message:', err)
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Invalid message format',
      }))
    }
  })

  // Handle WebSocket close
  ws.on('close', () => {
    console.log('Client disconnected')
    sessionId = null
  })

  // Handle WebSocket errors
  ws.on('error', (err) => {
    console.error('WebSocket error:', err)
  })
})

// Handle server shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down bridge server...')
  wss.clients.forEach((ws) => {
    ws.close()
  })
  wss.close(() => {
    console.log('Bridge server closed')
    process.exit(0)
  })
})

console.log(`Bridge server running on ws://localhost:${PORT}`)
console.log('Press Ctrl+C to stop')
