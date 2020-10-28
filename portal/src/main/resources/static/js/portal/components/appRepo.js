export default `
  <!-- Navbar -->
  <nav class="navbar navbar-expand-lg navbar-transparent sticky-top">
    <div class="navbar-form"></div>
    <div class="container-fluid">
      <div class="col-2"></div>
      <button class="navbar-toggler" type="button" data-toggle="collapse" aria-controls="navigation-index"
        aria-expanded="false" aria-label="Toggle navigation">
        <span class="sr-only">Toggle navigation</span>
        <span class="navbar-toggler-icon icon-bar"></span>
        <span class="navbar-toggler-icon icon-bar"></span>
        <span class="navbar-toggler-icon icon-bar"></span>
      </button>
    </div>
  </nav>
  <!-- End Navbar -->

  <div class="content">
    <div class="container-fluid">

      <div class="row">
        <div class="col-md-3">
          <div class="card ">
            <div class="card-body text-center">
              <h5 class="card-text">Apache HTTP Server</h5>
              <button class="btn btn-success btn-install">Install</button>
              <input type="hidden" value="apache">
              <button class="btn btn-warning btn-delete">Delete</button>
              <input type="hidden" value="apache">
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card ">
            <div class="card-body text-center">
              <h5 class="card-text">Maria DB</h5>
              <button class="btn btn-success btn-install">Install</button>
              <input type="hidden" value="maria">
              <button class="btn btn-warning btn-delete">Delete</button>
              <input type="hidden" value="maria">
              </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card ">
            <div class="card-body text-center">
              <h5 class="card-text">ETRI SIM</h5>
              <button class="btn btn-success btn-install">Install</button>
              <input type="hidden" value="etri-sim">
              <button class="btn btn-warning btn-delete">Delete</button>
              <input type="hidden" value="etri-sim">
              </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card ">
            <div class="card-body text-center">
              <h5 class="card-text">WizOnTech SIM</h5>
              <button class="btn btn-success btn-install">Install</button>
              <input type="hidden" value="wizontech-sim">
              <button class="btn btn-warning btn-delete">Delete</button>
              <input type="hidden" value="wizontech-sim">
              </div>
          </div>
        </div>
      </div>

      <!--
      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header card-header-success card-header-icon">
              <div class="card-icon">
                <i class="material-icons">backup</i>
              </div>
              <h4 class="card-title">Command</h4>
            </div>
            <div class="card-body">
              <form onsubmit="return false;">
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group has-danger is-filled">
                      <input type="text" id="appsCommand" class="form-control" value="" placeholder="Enter a command">
                    </div>
                  </div>
                  <div class="col-md-6">
                    <input type="submit" id="btnCommand" class="btn btn-danger btn-round btn-sm" value="COMMIT"></input>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12">
          <pre class="standard-output"></pre>
        </div>
      </div>
      --!>
    </div>
  </div>
`;