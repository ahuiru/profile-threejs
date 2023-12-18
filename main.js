window.addEventListener('load', init);

function init() {
  const width = 960;
  const height = 540;
  let rot = 0;

  // レンダラー
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#myCanvas')
  })
  renderer.setSize(window.innerWidth, window.innerHeight)

  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(45, width / height);

  // 球体生成
  const earthGeometry = new THREE.SphereGeometry(300, 40, 30)
  const marsGeometry = new THREE.SphereGeometry(100, 30, 30)
  const venusGeometry = new THREE.SphereGeometry(220, 30, 30)

  // 地球マテリアル
  const earthMaterial = new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load("images/earthmap1k.jpg"),
  });
  // 火星マテリアル
  const marsMaterial = new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load("images/mars.jpg"),
  });
  // 金星マテリアル
  const venusMaterial = new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load("images/venus.jpg"),
  });


  // 地球メッシュ
  const earth = new THREE.Mesh(earthGeometry, earthMaterial);
  scene.add(earth);
  // 火星メッシュ
  const mars = new THREE.Mesh(marsGeometry, marsMaterial);
  mars.position.x = 1000;
  mars.position.y = 500;
  mars.position.z = -70;
  scene.add(mars);
  // 金星メッシュ
  const venus = new THREE.Mesh(venusGeometry, venusMaterial);
  venus.position.x = -10;
  venus.position.y = -130;
  venus.position.z = 1000;
  scene.add(venus);

  // 平行光源
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.9)
  directionalLight.position.set(1, 1, 1)
  scene.add(directionalLight)

  // ポイント光源
  const pointLight = new THREE.PointLight( 0xffffff, 2, 1000 );
  scene.add(pointLight);
  const pointLightHelper = new THREE.PointLightHelper(pointLight, 30);
  scene.add(pointLightHelper);

  // 星屑
  createStarField();

  // 星屑生成関数
  function createStarField() {
    // x,y,z座標の値がランダムに入った配列を生成
    const vertices = []

    for(let i = 0; i < 500; i++) {
      const x = 3000 * (Math.random() - 0.5);
      const y = 3000 * (Math.random() - 0.5);
      const z = 3000 * (Math.random() - 0.5);
      vertices.push(x, y, z)
    }
    // 星屑の形状
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );

    // 材質(マテリアルの作成)
    const material = new THREE.PointsMaterial({
      size: 8,
      color: 0xffffff
    });

    // メッシュ
    const stars = new THREE.Points(geometry, material)
    scene.add(stars)
  }

  // フレームごとに呼び出される関数
  function tick() {
    rot += 0.5;

    // ラジアン変換
    const radian = (rot * Math.PI) / 180;

    // 角度に応じてカメラの位置を変更
    camera.position.x = 1000 * Math.sin(radian);
    camera.position.z = 2000 * Math.cos(radian);

    // カメラの見る位置
    camera.lookAt(new THREE.Vector3(0, 0, -400));

    // ライトを周回
    pointLight.position.set(
      500 * Math.sin(Date.now() / 500),
      500 * Math.sin(Date.now() / 500),
      500 * Math.cos(Date.now() / 500)
    )

    // レンダリング
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick()
  window.addEventListener("resize", onWindowResize);

  /* ウィンドウ変更時にサイズを維持する処理 */
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
}


// ポップアップ
const showImageButton = document.getElementById('showImageButton');
const imageContainer = document.getElementById('imageContainer');
const displayedImage = document.getElementById('displayedImage');

showImageButton.addEventListener("click", function(){
  displayedImage.src = 'images/profile.jpg';
  imageContainer.style.display = 'block';
  setTimeout(function () {
    imageContainer.style.opacity = '1';
  }, 100);
});

displayedImage.addEventListener("click", function() {
  imageContainer.style.opacity = '0';
  setTimeout(function () {
    imageContainer.style.display = 'none';
  }, 300);
})
