document.addEventListener('DOMContentLoaded', function() {
    const cityTrigger = document.getElementById('sender_city_trigger');
    const cityOptions = document.getElementById('sender_city_options');
    const cityWrapper = document.getElementById('sender_city_wrapper');

    const districtTrigger = document.getElementById('sender_district_trigger');
    const districtOptions = document.getElementById('sender_district_options');
    const districtWrapper = document.getElementById('sender_district_wrapper');

    const wardTrigger = document.getElementById('sender_ward_trigger');
    const wardOptions = document.getElementById('sender_ward_options');
    const wardWrapper = document.getElementById('sender_ward_wrapper');

    // Dummy data for demonstration. Replace with actual API calls.
    const dummyCities = [
        { id: 'ag', name: 'Tỉnh An Giang' },
        { id: 'brvt', name: 'Tỉnh Bà Rịa - Vũng Tàu' },
        { id: 'bgi', name: 'Tỉnh Bắc Giang' },
        { id: 'bk', name: 'Tỉnh Bắc Kạn' },
        { id: 'bl', name: 'Tỉnh Bạc Liêu' },
        { id: 'bn', name: 'Tỉnh Bắc Ninh' },
        { id: 'bt', name: 'Tỉnh Bến Tre' },
        { id: 'bd', name: 'Tỉnh Bình Dương' },
        { id: 'bp', name: 'Tỉnh Bình Phước' },
        { id: 'bth', name: 'Tỉnh Bình Thuận' },
        { id: 'bdh', name: 'Tỉnh Bình Định' },
        { id: 'cm', name: 'Tỉnh Cà Mau' }
    ];

    const dummyDistricts = {
        'ag': [
            { id: 'cpc', name: 'TP Châu Đốc' },
            { id: 'txdt', name: 'TX Tân Châu' },
            { id: 'ah', name: 'Huyện An Phú' }
        ],
        'brvt': [
            { id: 'vt', name: 'TP Vũng Tàu' },
            { id: 'br', name: 'TP Bà Rịa' },
            { id: 'cl', name: 'Huyện Châu Đức' }
        ]
    };

    const dummyWards = {
        'cpc': [
            { id: 'pmc', name: 'Phường Châu Phú B' },
            { id: 'vv', name: 'Phường Vĩnh Mỹ' }
        ],
        'vt': [
            { id: 'p1', name: 'Phường 1' },
            { id: 'p2', name: 'Phường 2' }
        ]
    };

    function renderOptions(optionsArray, targetElement, triggerElement, wrapperElement, nextDropdownTrigger) {
        targetElement.innerHTML = '';
        optionsArray.forEach(option => {
            const optionDiv = document.createElement('div');
            optionDiv.classList.add('custom-option');
            optionDiv.dataset.value = option.id;
            optionDiv.textContent = option.name;
            optionDiv.addEventListener('click', function() {
                triggerElement.textContent = option.name;
                wrapperElement.classList.remove('active');
                // Optionally, update a hidden input if you need to submit the value with the form
                // const hiddenInput = document.createElement('input');
                // hiddenInput.type = 'hidden';
                // hiddenInput.name = triggerElement.id.replace('_trigger', '');
                // hiddenInput.value = option.id;
                // wrapperElement.appendChild(hiddenInput);

                if (nextDropdownTrigger) {
                    nextDropdownTrigger(option.id);
                }
            });
            targetElement.appendChild(optionDiv);
        });
    }

    function toggleDropdown(wrapper) {
        wrapper.classList.toggle('active');
    }

    cityTrigger.addEventListener('click', function() {
        toggleDropdown(cityWrapper);
        renderOptions(dummyCities, cityOptions, cityTrigger, cityWrapper, loadDistricts);
    });

    function loadDistricts(cityId) {
        districtTrigger.textContent = 'Chọn Quận/Huyện'; // Reset district display
        districtWrapper.classList.remove('active'); // Close district dropdown
        wardTrigger.textContent = 'Chọn Phường/Xã'; // Reset ward display
        wardWrapper.classList.remove('active'); // Close ward dropdown

        const districts = dummyDistricts[cityId] || [];
        renderOptions(districts, districtOptions, districtTrigger, districtWrapper, loadWards);
    }

    districtTrigger.addEventListener('click', function() {
        toggleDropdown(districtWrapper);
    });

    function loadWards(districtId) {
        wardTrigger.textContent = 'Chọn Phường/Xã'; // Reset ward display
        wardWrapper.classList.remove('active'); // Close ward dropdown

        const wards = dummyWards[districtId] || [];
        renderOptions(wards, wardOptions, wardTrigger, wardWrapper, null);
    }

    wardTrigger.addEventListener('click', function() {
        toggleDropdown(wardWrapper);
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(event) {
        if (!cityWrapper.contains(event.target)) {
            cityWrapper.classList.remove('active');
        }
        if (!districtWrapper.contains(event.target)) {
            districtWrapper.classList.remove('active');
        }
        if (!wardWrapper.contains(event.target)) {
            wardWrapper.classList.remove('active');
        }
    });

    // Initial load for cities
    // renderOptions(dummyCities, cityOptions, cityTrigger, cityWrapper, loadDistricts);
}); 