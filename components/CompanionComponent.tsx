'use client'

import { cn, getSubjectColor, configureAssistant } from '@/lib/utils'
import { vapi } from '@/lib/vapi.sdk'
import Lottie, { LottieRefCurrentProps } from 'lottie-react'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import voicerecording from '@/constants/voicerecording.json'
import { addToSessionHistory } from '@/lib/actions/companion.actions'

enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED'
}

const CompanionComponent = ({
  companionId,
  subject,
  topic,
  name,
  userName,
  userImage,
  style,
  voice
}: CompanionComponentProps) => {

  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [messages, setMessages] = useState<SavedMessage[]>([])

  const lottieRef = useRef<LottieRefCurrentProps>(null)

  // 🎤 Lottie animation
  useEffect(() => {
    if (isSpeaking) {
      lottieRef.current?.play()
    } else {
      lottieRef.current?.stop()
    }
  }, [isSpeaking])

  // 🎧 Vapi events
  useEffect(() => {

    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE)
      setIsMuted(false)
    }

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED)
      setIsSpeaking(false)
      setIsMuted(false)
      addToSessionHistory(companionId)
    }

    const onMessage = (message: any) => {
      if (message?.type === 'transcript' && message?.transcriptType === 'final') {
        setMessages(prev => [
          { role: message.role, content: message.transcript },
          ...prev
        ])
      }
    }

    const onSpeechStart = () => setIsSpeaking(true)
    const onSpeechEnd = () => setIsSpeaking(false)

    vapi.on('call-start', onCallStart)
    vapi.on('call-end', onCallEnd)
    vapi.on('message', onMessage)
    vapi.on('speech-start', onSpeechStart)
    vapi.on('speech-end', onSpeechEnd)

    return () => {
      vapi.off('call-start', onCallStart)
      vapi.off('call-end', onCallEnd)
      vapi.off('message', onMessage)
      vapi.off('speech-start', onSpeechStart)
      vapi.off('speech-end', onSpeechEnd)
    }

  }, [])

  // 🎤 Toggle Microphone (SAFE)
 const toggleMicrophone = () => {
  if (callStatus !== CallStatus.ACTIVE) return

  try {
    const nextMutedState = !isMuted

    // Cast to any to bypass wrong TS types
    ;(vapi as any).setMuted(nextMutedState)

    setIsMuted(nextMutedState)
  } catch (error) {
    console.log("Mic toggle error:", error)
  }
}


  // 📞 Start Call
  const handleCall = async () => {
    try {
      setCallStatus(CallStatus.CONNECTING)

      const assistantConfig = configureAssistant(
        voice,
        style,
        topic,
        subject
      )

      await vapi.start(assistantConfig)

    } catch (error) {
      console.log('Call start error:', error)
      setCallStatus(CallStatus.INACTIVE)
    }
  }

  // ❌ End Call
  const handleDisconnect = () => {
    try {
      vapi.stop()
      setCallStatus(CallStatus.FINISHED)
    } catch (error) {
      console.log('Call stop error:', error)
    }
  }

  return (
    <section className='flex flex-col h-[70vh]'>

      {/* TOP */}
      <section className='flex gap-8 max-sm:flex-col'>

        {/* Companion */}
        <div className='companion-section'>
          <div
            className='companion-avatar'
            style={{ backgroundColor: getSubjectColor(subject) }}
          >

            <div className={cn(
              'absolute transition-opacity duration-500',
              callStatus === CallStatus.ACTIVE ? 'opacity-0' : 'opacity-100'
            )}>
              <Image
                src={`/icons/${subject}.svg`}
                alt={subject}
                width={150}
                height={150}
              />
            </div>

            <div className={cn(
              'absolute transition-opacity duration-500',
              callStatus === CallStatus.ACTIVE ? 'opacity-100' : 'opacity-0'
            )}>
              <Lottie
                lottieRef={lottieRef}
                animationData={voicerecording}
                autoPlay={false}
              />
            </div>

          </div>

          <p className='font-bold text-2xl'>{name}</p>
        </div>

        {/* User */}
        <div className='user-section'>
          <Image
            src={userImage}
            alt={userName}
            width={130}
            height={130}
            className='rounded-lg'
          />

          <p className='font-bold text-2xl'>{userName}</p>

          {/* Mic */}
          <button
            className='btn-mic'
            onClick={toggleMicrophone}
            disabled={callStatus !== CallStatus.ACTIVE}
          >
            <Image
              src={isMuted ? '/icons/mic-off.svg' : '/icons/mic-on.svg'}
              alt='mic'
              width={36}
              height={36}
            />
            <p className='max-sm:hidden'>
              {isMuted ? 'Turn on microphone' : 'Turn off microphone'}
            </p>
          </button>

          {/* Call */}
          <button
            className={cn(
              'rounded-lg py-2 transition-colors w-full text-white',
              callStatus === CallStatus.ACTIVE
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-blue-500 hover:bg-blue-600',
              callStatus === CallStatus.CONNECTING && 'animate-pulse bg-blue-400'
            )}
            onClick={
              callStatus === CallStatus.ACTIVE
                ? handleDisconnect
                : handleCall
            }
            disabled={callStatus === CallStatus.CONNECTING}
          >
            {callStatus === CallStatus.ACTIVE
              ? 'End Session'
              : callStatus === CallStatus.CONNECTING
                ? 'Connecting...'
                : 'Start Session'}
          </button>

        </div>
      </section>

      {/* Transcript */}
      <section className='transcript mt-6'>
        <div className='transcript-message no-scrollbar'>
          {messages.map((message, index) => (
            <p
              key={index}
              className={message.role === 'assistant'
                ? ''
                : 'text-primary'}
            >
              <strong>
                {message.role === 'assistant' ? name : userName}:
              </strong>{' '}
              {message.content}
            </p>
          ))}
        </div>
      </section>

    </section>
  )
}

export default CompanionComponent
