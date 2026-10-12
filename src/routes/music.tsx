import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import music from '../data/music.json'
import { seo } from '../lib/seo'
import { Icon } from '../components/Icon'

export const Route = createFileRoute('/music')({
  head: () =>
    seo({
      title: 'Music - Alexander Agung Raya',
      description:
        "What I'm listening to right now, straight from my Last.fm scrobbles.",
      path: '/music',
      ogImage: '/og/music.png',
    }),
  component: MusicPage,
})

interface Track {
  name: string
  artist: string
  url?: string
  image?: string
  date: number | null
  nowPlaying: boolean
}

interface Artist {
  name: string
  playcount: number
  url?: string
  image?: string
}

interface TopTrack {
  name: string
  artist: string
  url?: string
  image?: string
  playcount: number
}

const data = music as {
  username: string
  recent: Track[]
  topArtists: Artist[]
  topTracks: TopTrack[]
  fetchedAt: string
}

type Snapshot = typeof data

function relTime(ms: number | null): string {
  if (!ms) return ''
  const diff = Date.now() - ms
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(months / 12)}y ago`
}

/** Album art with a graceful icon fallback when Last.fm has no artwork. */
function Artwork({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  if (src) {
    return (
      <img
        className={className}
        src={src}
        alt={alt}
        width="174"
        height="174"
        loading="lazy"
        decoding="async"
      />
    )
  }
  return (
    <div className={`music-art-fallback ${className ?? ''}`} role="img" aria-label={alt}>
      <Icon name="mdi:music" />
    </div>
  )
}

function NowPlayingCard({ track }: { track: Track }) {
  return (
    <a
      className="np-card"
      href={track.url ?? `https://www.last.fm/user/${data.username}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Artwork src={track.image} alt={`${track.name} album art`} className="np-art" />
      <div className="np-body">
        <p className="np-label">
          <span className="np-pulse" aria-hidden="true" /> Scrobbling now
        </p>
        <p className="np-track">{track.name}</p>
        <p className="np-artist">{track.artist}</p>
        <div className="eq" aria-hidden="true">
          <span /><span /><span /><span /><span />
        </div>
      </div>
    </a>
  )
}

/** Re-fetch the snapshot from the worker proxy every minute. */
function useLiveSnapshot(): { snap: Snapshot; isLive: boolean } {
  const [snap, setSnap] = useState<Snapshot>(data)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    let alive = true
    async function poll() {
      try {
        const res = await fetch('/api/lastfm')
        if (!res.ok) return
        const next = (await res.json()) as Snapshot
        if (alive && Array.isArray(next.recent)) {
          setSnap(next)
          setIsLive(true)
        }
      } catch {
        // Offline or dev server without the proxy — keep the build snapshot.
      }
    }
    poll()
    const id = setInterval(poll, 60_000)
    return () => {
      alive = false
      clearInterval(id)
    }
  }, [])

  return { snap, isLive }
}

function MusicPage() {
  const { snap, isLive } = useLiveSnapshot()
  const { recent, topArtists, topTracks, username, fetchedAt } = snap
  const nowPlaying = recent.find((t) => t.nowPlaying)
  const history = recent.filter((t) => !t.nowPlaying)
  const empty = recent.length === 0 && topArtists.length === 0 && topTracks.length === 0

  return (
    <div className="wrap">
      <header className="hero">
        <h1>
          M<span className="sage">usic</span>
        </h1>
        <p className="hero-sub">
          <Icon name="mdi:music" />
          Scrobbled from{' '}
          <a
            className="uses-link"
            href={`https://www.last.fm/user/${username}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Last.fm
            <Icon name="mdi:arrow-top-right" />
          </a>
        </p>
        <p className="hero-copy">
          What I've been listening to lately — updated daily from my Last.fm
          scrobbles.
        </p>
      </header>

      {empty ? (
        <section className="block-section">
          <h2 className="section-title">
            <Icon name="mdi:music-note-outline" /> Nothing here yet
          </h2>
          <p className="hero-copy">
            No scrobbles here yet — once I play something with scrobbling on,
            it shows up here automatically.
          </p>
        </section>
      ) : (
        <>
          {nowPlaying && (
            <section className="block-section">
              <h2 className="section-title">
                <Icon name="mdi:play-circle-outline" /> Now Playing
              </h2>
              <NowPlayingCard track={nowPlaying} />
            </section>
          )}

          {history.length > 0 && (
            <section className="block-section">
              <h2 className="section-title">
                <Icon name="mdi:history" /> Recent Tracks
              </h2>
              <div className="music-grid">
                {history.map((track, i) => (
                  <a
                    className="music-card"
                    key={`${track.name}-${track.artist}-${i}`}
                    href={track.url ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Artwork
                      src={track.image}
                      alt={`${track.name} album art`}
                      className="music-card-art"
                    />
                    <p className="music-card-title">{track.name}</p>
                    <p className="music-card-sub">{track.artist}</p>
                    <p className="music-card-meta">
                      {track.date ? relTime(track.date) : ''}
                    </p>
                  </a>
                ))}
              </div>
            </section>
          )}

          {topArtists.length > 0 && (
            <section className="block-section">
              <h2 className="section-title">
                <Icon name="mdi:fire" /> Top Artists{' '}
                <span className="thin">· 1 Month</span>
              </h2>
              <div className="music-grid artists">
                {topArtists.map((artist) => (
                  <a
                    className="music-card"
                    key={artist.name}
                    href={artist.url ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Artwork
                      src={artist.image}
                      alt={`${artist.name} artist photo`}
                      className="music-card-art round"
                    />
                    <p className="music-card-title">{artist.name}</p>
                    <p className="music-card-meta">
                      {artist.playcount.toLocaleString('en-US')} plays
                    </p>
                  </a>
                ))}
              </div>
            </section>
          )}

          {topTracks.length > 0 && (
            <section className="block-section">
              <h2 className="section-title">
                <Icon name="mdi:trending-up" /> Top Tracks{' '}
                <span className="thin">· 1 Month</span>
              </h2>
              <div className="music-grid">
                {topTracks.map((track) => (
                  <a
                    className="music-card"
                    key={`${track.name}-${track.artist}`}
                    href={track.url ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Artwork
                      src={track.image}
                      alt={`${track.name} album art`}
                      className="music-card-art"
                    />
                    <p className="music-card-title">{track.name}</p>
                    <p className="music-card-sub">{track.artist}</p>
                    <p className="music-card-meta">
                      {track.playcount.toLocaleString('en-US')} plays
                    </p>
                  </a>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <p className="hero-copy muted">
        Last synced{' '}
        {new Date(fetchedAt).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
        {isLive ? ' · live, refreshes every minute' : ''}
      </p>
    </div>
  )
}
