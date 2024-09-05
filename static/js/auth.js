$('#auth').html(`
    <div class="col-12 col-md-3" style="color: #252422;">
        <div class="d-flex justify-content-center align-items-center mt-3" style="width: 100%; margin-bottom: 100px;">
            <div style="width: 15%;">
                <img style="object-fit: cover; width: 100%; height: auto;" src="../static/img/icon.webp" alt="Icon">
            </div>
        </div>
        <h2 class="fw-bolder w-100 mb-3 text-center">Create an Account</h2>
        <input type="email" placeholder="Email" class="ps-4 form-control mb-3 fs-6 form-control-lg">
        <input type="password" placeholder="Password" class="ps-4 form-control fs-6 form-control-lg">
        <button class="mt-3 w-100 btn-lg fs-6 btn" style="background-color: #009429; color: white;">Continue</button>
        <p class="text-center mt-3 mb-3">or</p>
        <div>
            <a href="/login" class="p-2 mt-3 w-100 btn btn-lg fs-6 border d-flex flex-row align-items-center text-muted">
                <i class="bi bi-google fs-5 me-4"></i> Continue with Google
            </a>
            <a href="#" class="p-2 mt-3 w-100 btn btn-lg fs-6 border d-flex flex-row align-items-center text-muted">
                <i class="bi bi-facebook fs-5 me-4"></i> Continue with Facebook
            </a>
        </div>
    </div>
    `);
    