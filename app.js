document.addEventListener('DOMContentLoaded', function() {
    const contenedorPeliculas = document.getElementById('contenedor-peliculas');
    const reproductor = document.getElementById('reproductor');
    const videoPlayer = document.getElementById('video-player');
    const btnCerrar = document.getElementById('btn-cerrar');
    const btnPlayPause = document.getElementById('btn-play-pause');
    const btnMute = document.getElementById('btn-mute');
    const btnPantallaCompleta = document.getElementById('btn-pantalla-completa');
    const barraProgreso = document.getElementById('progreso');
    const volumenControl = document.getElementById('volumen');
    const tiempoActual = document.getElementById('tiempo-actual');
    const tiempoTotal = document.getElementById('tiempo-total');
    const contenedorVideo = document.getElementById('contenedor-video');

    let timeoutOcultarControles;
    let mouseMoved = false;

    // Cargar y mostrar películas (código previo se mantiene igual)
    const peliculasAgrupadas = {};
    
    movies.forEach(pelicula => {
        const tipo = pelicula.title.split('<br>')[0];
        if (!peliculasAgrupadas[tipo]) {
            peliculasAgrupadas[tipo] = [];
        }
        peliculasAgrupadas[tipo].push(pelicula);
    });

    for (const [tipo, peliculas] of Object.entries(peliculasAgrupadas)) {
        const categoriaHTML = `
            <h3 class="titulo-categoria">${tipo}</h3>
            <div class="rejilla-peliculas" id="rejilla-${tipo.toLowerCase().replace(/\s+/g, '-')}">
                ${peliculas.map(pelicula => `
                    <div class="tarjeta-pelicula" data-url="${pelicula.url}">
                        <img src="${pelicula.thumbnail}" alt="${pelicula.title.replace('<br>', ' - ')}" class="imagen-pelicula">
                        <div class="info-pelicula">
                            <div class="titulo-pelicula">${pelicula.title}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        contenedorPeliculas.innerHTML += categoriaHTML;
    }

    // Event listeners para tarjetas de película
    document.querySelectorAll('.tarjeta-pelicula').forEach(tarjeta => {
        tarjeta.addEventListener('click', function() {
            const videoUrl = this.getAttribute('data-url');
            reproducirVideo(videoUrl);
        });
    });

    // Función para reproducir video
    function reproducirVideo(url) {
        videoPlayer.src = url;
        reproductor.style.display = 'flex';
        
        // Esperar a que los metadatos del video estén cargados
        videoPlayer.addEventListener('loadedmetadata', function() {
            tiempoTotal.textContent = formatTime(videoPlayer.duration);
            videoPlayer.play();
            btnPlayPause.innerHTML = '<i class="fas fa-pause"></i>';
        });
    }

    // Event listeners para controles del reproductor
    btnPlayPause.addEventListener('click', function() {
        if (videoPlayer.paused) {
            videoPlayer.play();
            btnPlayPause.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            videoPlayer.pause();
            btnPlayPause.innerHTML = '<i class="fas fa-play"></i>';
        }
        resetearTimeoutOcultar();
    });

    btnMute.addEventListener('click', function() {
        if (videoPlayer.muted) {
            videoPlayer.muted = false;
            btnMute.innerHTML = '<i class="fas fa-volume-up"></i>';
        } else {
            videoPlayer.muted = true;
            btnMute.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
        resetearTimeoutOcultar();
    });

    volumenControl.addEventListener('input', function() {
        videoPlayer.volume = this.value;
        if (videoPlayer.volume == 0) {
            btnMute.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            btnMute.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
        resetearTimeoutOcultar();
    });

    btnPantallaCompleta.addEventListener('click', function() {
        if (!document.fullscreenElement) {
            contenedorVideo.requestFullscreen().catch(err => {
                console.error(`Error al intentar pantalla completa: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
        resetearTimeoutOcultar();
    });

    barraProgreso.addEventListener('input', function() {
        const tiempo = (videoPlayer.duration / 100) * this.value;
        videoPlayer.currentTime = tiempo;
        resetearTimeoutOcultar();
    });

    videoPlayer.addEventListener('timeupdate', function() {
        const porcentaje = (videoPlayer.currentTime / videoPlayer.duration) * 100;
        barraProgreso.value = porcentaje;
        tiempoActual.textContent = formatTime(videoPlayer.currentTime);
    });

    videoPlayer.addEventListener('click', function() {
        if (videoPlayer.paused) {
            videoPlayer.play();
            btnPlayPause.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            videoPlayer.pause();
            btnPlayPause.innerHTML = '<i class="fas fa-play"></i>';
        }
        resetearTimeoutOcultar();
    });

    btnCerrar.addEventListener('click', cerrarReproductor);

    // Control de visibilidad de controles
    contenedorVideo.addEventListener('mousemove', function() {
        mouseMoved = true;
        document.getElementById('controles-video').style.opacity = '1';
        btnCerrar.style.opacity = '1';
        resetearTimeoutOcultar();
    });

    function resetearTimeoutOcultar() {
        clearTimeout(timeoutOcultarControles);
        timeoutOcultarControles = setTimeout(() => {
            if (mouseMoved) {
                document.getElementById('controles-video').style.opacity = '0';
                btnCerrar.style.opacity = '0';
                mouseMoved = false;
            }
        }, 3000);
    }

    // Función para formatear tiempo (MM:SS)
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // Función para cerrar reproductor
    function cerrarReproductor() {
        videoPlayer.pause();
        videoPlayer.src = '';
        reproductor.style.display = 'none';
    }
});