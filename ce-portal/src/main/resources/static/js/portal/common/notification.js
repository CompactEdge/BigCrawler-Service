const notification = {
  show: function(from, align, message, pick) {
    const type = ['', 'info', 'danger', 'success', 'warning', 'rose', 'primary'];

    let color;
    if (pick) {
      color = pick;
    } else {
      color = Math.floor((Math.random() * 6) + 1);
    }

    $.notify({
      icon: "add_alert",
      message: message

    }, {
      type: type[color],
      timer: 3000,
      placement: {
        from: from,
        align: align
      }
    });
  }
}

export default notification;