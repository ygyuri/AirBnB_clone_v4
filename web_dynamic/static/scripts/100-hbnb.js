$(() => {
    $.get('http://0.0.0.0:5001/api/v1/status/', data => {
      if (data.status === 'OK') {
        $('#api_status').addClass('available');
      } else {
        $('#api_status').removeClass('available');
      }
    });

    $.ajax({
      method: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      data: '{}',
      dataType: 'json',
      contentType: 'application/json',
      success: function (places) {
        setPlaces(places)
      },
    });

    const checkedAmenities = {};
    const checkedStates = {};
    const checkedCities = {};
    const checkedLocations = {};

    $('.locations > .popover > ul > li > input[type=checkbox]').on('change', function () {
      if ($(this).is(':checked')) {
        checkedStates[$(this).data('id')] = $(this).data('name');
        checkedLocations[$(this).data('id')] = $(this).data('name');
      } else {
        delete checkedStates[$(this).data('id')];
        delete checkedLocations[$(this).data('id')];
      }
      const locations = Object.values(checkedLocations);
      const locationsList = locations.join(', ').slice(0, 30);
      $('.locations h4').html(locationsList.length > 0 ? `<em>${locationsList}</em>` : '&nbsp;');
    });

    $('.locations > .popover > ul > li > ul > li > input[type=checkbox]').on('change', function () {
      if ($(this).is(':checked')) {
        checkedCities[$(this).data('id')] = $(this).data('name');
        checkedLocations[$(this).data('id')] = $(this).data('name');
      } else {
        delete checkedCities[$(this).data('id')];
        delete checkedLocations[$(this).data('id')];
      }
      const locations = Object.values(checkedLocations);
      const locationsList = locations.join(', ').slice(0, 30);
      $('.locations h4').html(locationsList.length > 0 ? `<em>${locationsList}</em>` : '&nbsp;');
    });

    $('.amenities > .popover > ul > li > input[type=checkbox]').on('change', function () {
      if ($(this).is(':checked')) {
        checkedAmenities[$(this).data('id')] = $(this).data('name');
      } else {
        delete checkedAmenities[$(this).data('id')];
      }
      const amenities = Object.values(checkedAmenities);
      const amenitiesList = amenities.join(', ').slice(0, 30);
      $('.amenities h4').html(amenitiesList.length > 0 ? `<em>${amenitiesList}</em>` : '&nbsp;');
    });

    $('button').on('click', e => {
      e.preventDefault();
      const payload = {
        amenities: Object.keys(checkedAmenities),
        states: Object.keys(checkedStates),
        cities: Object.keys(checkedCities),
      };
      $('article').remove();
      $.ajax({
        method: 'POST',
        url: 'http://0.0.0.0:5001/api/v1/places_search/',
        data: JSON.stringify(payload),
        dataType: 'json',
        contentType: 'application/json',
        success: function (places) {
          setPlaces(places)
        },
      });
    });

    const setPlaces = places => {
      places.forEach(place => {
        const s = place.max_guest !== 1 ? 's' : '';
        const s2 = place.number_rooms !== 1 ? 's' : '';
        const s3 = place.number_bathrooms !== 1 ? 's' : '';
        const html = `<article>
          <div class="title_box">
            <h2>${place.name}</h2>
            <div class="price_by_night">$${place.price_by_night}</div>
          </div>
          <div class="information">
            <div class="max_guest">${place.max_guest} Guest${s}</div>
            <div class="number_rooms">${place.number_rooms} Bedroom${s2}</div>
            <div class="number_bathrooms">${place.number_bathrooms} Bathroom${s3}</div>
          </div>
          <div class="user"></div>
          <div class="description">${place.description}</div>
        </article>`;
        $('section.places').append(html);
      });
    };
  });
