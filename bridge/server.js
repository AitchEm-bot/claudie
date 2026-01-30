/**
 * WebSocket Bridge Server for Claude Code
 *
 * This server creates a WebSocket endpoint that bridges the chat interface
 * to Claude Code running locally. It spawns Claude Code as a child process
 * and pipes messages between the WebSocket and Claude Code's stdin/stdout.
 *
 * Usage: npm run bridge
 * Or: node bridge/server.js
 */

const { WebSocketServer } = require('ws')
const { spawn } = require('child_process')

const PORT = 8765

const wss = new WebSocketServer({ port: PORT })

console.log(`Bridge server starting on ws://localhost:${PORT}`)

wss.on('connection', (ws) => {
  console.log('Client connected')

  let claudeProcess = null
  let buffer = ''

  // Spawn Claude Code process in interactive mode
  try {
    claudeProcess = spawn('claude', [], {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: process.platform === 'win32',
    })

    console.log('Claude Code process started')

    // Handle stdout from Claude
    claudeProcess.stdout.on('data', (data) => {
      const text = data.toString()
      buffer += text

      // Try to detect complete responses
      // This is a simple heuristic - Claude Code's output format may vary
      const lines = buffer.split('\n')

      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i].trim()
        if (line) {
          try {
            ws.send(JSON.stringify({
              type: 'stream_chunk',
              content: line + '\n',
            }))
          } catch (err) {
            console.error('Failed to send message:', err)
          }
        }
      }

      // Keep the last incomplete line in buffer
      buffer = lines[lines.length - 1]
    })

    // Handle stderr from Claude
    claudeProcess.stderr.on('data', (data) => {
      console.error('Claude stderr:', data.toString())
    })

    // Handle process exit
    claudeProcess.on('close', (code) => {
      console.log(`Claude Code process exited with code ${code}`)
      try {
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Claude Code process ended',
        }))
      } catch {
        // WebSocket may already be closed
      }
    })

    claudeProcess.on('error', (err) => {
      console.error('Failed to start Claude Code:', err)
      try {
        ws.send(JSON.stringify({
          type: 'error',
          message: `Failed to start Claude Code: ${err.message}`,
        }))
      } catch {
        // WebSocket may already be closed
      }
    })

  } catch (err) {
    console.error('Error spawning Claude Code:', err)
    ws.send(JSON.stringify({
      type: 'error',
      message: `Could not start Claude Code: ${err.message}`,
    }))
  }

  // Handle incoming messages from the web client
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString())

      if (message.type === 'message' && message.content && claudeProcess) {
        console.log('Sending to Claude:', message.content.substring(0, 50) + '...')

        // Send stream start notification
        ws.send(JSON.stringify({ type: 'stream_start' }))

        // Write the message to Claude Code's stdin
        claudeProcess.stdin.write(message.content + '\n')
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
    if (claudeProcess) {
      claudeProcess.kill()
      claudeProcess = null
    }
  })

  // Handle WebSocket errors
  ws.on('error', (err) => {
    console.error('WebSocket error:', err)
    if (claudeProcess) {
      claudeProcess.kill()
      claudeProcess = null
    }
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
