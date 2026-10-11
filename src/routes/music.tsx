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
  date: number | null
  nowPlaying: boolean
}

interface Artist {
  name: string
  playcount: number
  url?: string
}

interface TopTrack {
  name: string
  artist: string
  url?: string
  playcount: number
}

const data = music as {
  username: string
  recent: Track[]
  topArtists: Artist[]
  topTracks: TopTrack[]
  fetchedAt: string
}

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

function TrackLink({ track }: { track: Track | TopTrack }) {
  if (track.url) {
    return (
      <a
        className="uses-link"
        href={track.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {track.name}
        <Icon name="mdi:arrow-top-right" />
      </a>
    )
  }
  return <>{track.name}</>
}

function MusicPage() {
  const { recent, topArtists, topTracks, username, fetchedAt } = data
  const nowPlaying = recent.find((t) => t.nowPlaying)
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
            Music data hasn't been fetched yet — it will show up automatically
            once the Last.fm snapshot runs on the next build.
          </p>
        </section>
      ) : (
        <>
          {nowPlaying && (
            <section className="block-section">
              <h2 className="section-title">
                <Icon name="mdi:play-circle-outline" /> Now Playing
              </h2>
              <table className="uses-table">
                <tbody>
                  <tr>
                    <th scope="row">
                      <TrackLink track={nowPlaying} />
                    </th>
                    <td>
                      {nowPlaying.artist}
                      {nowPlaying.artist ? ' — ' : ''}
                      <span className="sage">live from Last.fm</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>
          )}

          {recent.length > 0 && (
            <section className="block-section">
              <h2 className="section-title">
                <Icon name="mdi:history" /> Recent Tracks
              </h2>
              <table className="uses-table">
                <tbody>
                  {recent.map((track, i) => (
                    <tr key={`${track.name}-${track.artist}-${i}`}>
                      <th scope="row">
                        <TrackLink track={track} />
                      </th>
                      <td>
                        {track.artist}
                        {track.date ? `${track.artist ? ' — ' : ''}${relTime(track.date)}` : ''}
                        {track.nowPlaying ? ' — now playing' : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          <div className="grid-two">
            {topArtists.length > 0 && (
              <section className="block-section">
                <h2 className="section-title">
                  <Icon name="mdi:fire" /> Top Artists · 1 Month
                </h2>
                <table className="uses-table">
                  <tbody>
                    {topArtists.map((artist) => (
                      <tr key={artist.name}>
                        <th scope="row">
                          {artist.url ? (
                            <a
                              className="uses-link"
                              href={artist.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {artist.name}
                              <Icon name="mdi:arrow-top-right" />
                            </a>
                          ) : (
                            artist.name
                          )}
                        </th>
                        <td>{artist.playcount.toLocaleString('en-US')} plays</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            {topTracks.length > 0 && (
              <section className="block-section">
                <h2 className="section-title">
                  <Icon name="mdi:trending-up" /> Top Tracks · 1 Month
                </h2>
                <table className="uses-table">
                  <tbody>
                    {topTracks.map((track) => (
                      <tr key={`${track.name}-${track.artist}`}>
                        <th scope="row">
                          <TrackLink track={track} />
                        </th>
                        <td>
                          {track.artist} —{' '}
                          {track.playcount.toLocaleString('en-US')} plays
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}
          </div>
        </>
      )}

      <p className="hero-copy muted">
        Last synced{' '}
        {new Date(fetchedAt).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </p>
    </div>
  )
}
