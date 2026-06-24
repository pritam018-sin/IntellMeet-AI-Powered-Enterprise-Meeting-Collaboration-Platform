class PeerService {
    createPeer() {
        return new RTCPeerConnection({
            iceServers: [
                {
                    urls: [
                        'stun:stun.l.google.com:19302',
                        'stun:global.stun.twilio.com:3478',
                    ]
                }
            ]
        });
    }

    async getAnswer(peer, offer) {
        if (peer) {
            await peer.setRemoteDescription(new RTCSessionDescription(offer));
            const ans = await peer.createAnswer();
            await peer.setLocalDescription(new RTCSessionDescription(ans));
            return ans;
        }
    }

    async getOffer(peer) {
        if (peer) {
            const offer = await peer.createOffer();
            await peer.setLocalDescription(new RTCSessionDescription(offer));
            return offer;
        }
    }
}

export default new PeerService();