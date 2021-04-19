document.addEventListener('DOMContentLoaded', () => {
  const passTestButton = document.querySelector('.pass-test__button'),
        overlay = document.querySelector('.overlay'),
        quiz = document.querySelector('.quiz'),
        form = document.querySelector('form.quiz-body__form'),
        formItems = document.querySelectorAll('fieldset'),
        btnsNext = document.querySelectorAll('.form-button__btn-next'),
        btnsPrev = document.querySelectorAll('.form-button__btn-prev'),
        percentage = document.querySelector('#quiz-position__percent-change'),
        phoneInput = document.querySelector('#quiz-phone'),
        answerObj = {
          step0: {
            question: '',
            answer: [],
          },
          step1: {
            question: '',
            answer: [],
          },
          step2: {
            question: '',
            answer: [],
          },
          step3: {
            question: '',
            answer: [],
          },
          step4: {
            name: '',
            phone: '',
            email: '',
            call: '',
          },
        };     
        
        let count = 0;
        percentage.textContent = count;

        phoneInput.addEventListener('input', () => {
          phoneInput.value = phoneInput.value.replace(/\D/g, '');
        });

        function nextPrevFormChange(elem, btnIndex) {          
          const parentForm = elem.closest('fieldset');

          formItems.forEach((formItm) => {
            if (parentForm === formItm) {

              if (elem .classList.contains('form-button__btn-next')) {
                formItems[btnIndex ].style.display = 'none';
                formItems[btnIndex + 1].style.display = 'block';
                count += 25;
                percentage.textContent = count;
              } else if (elem.classList.contains('form-button__btn-prev')) {
                formItems[btnIndex ].style.display = 'block';
                formItems[btnIndex + 1].style.display = 'none';
                count -= 25;
                percentage.textContent = count;
              }              
            }
          })

        }

        btnsPrev.forEach((btnPrev, btnIndex)=> {
          btnPrev.addEventListener('click', (e) => {
            e.preventDefault();
            nextPrevFormChange(btnPrev, btnIndex);        
          });
  
        });

        btnsNext.forEach((btnNext, btnIndex)=> {
          btnNext.addEventListener('click', (e) => {
            e.preventDefault();
            nextPrevFormChange(btnNext, btnIndex);
          });
          btnNext.disabled = true;
        });

    formItems.forEach((formItem, formIndex) => {
      if(formIndex !== 0) {
        formItem.style.display = 'none';
      } else {
        formItem.style.display = 'block';
      }

      if (formIndex !== formItems.length - 1) {
        const inputs = formItem.querySelectorAll('input'),
              formTitle = formItem.querySelector('.form__title');

        answerObj[`step${formIndex}`].question = formTitle.textContent;

        inputs.forEach(input => {
          const parent = input.parentNode;
          input.checked = false;
          parent.classList.remove('active-radio');
          parent.classList.remove('active-checkbox');

        });
      }
     

      formItem.addEventListener('change', (e) => {
        const target = e.target,
              inputsChecked = document.querySelectorAll('input:checked');

        if(formIndex !== formItems.length - 1) {
          answerObj[`step${formIndex}`].answer.length = 0;
        }        

        if (target.classList.contains('form__radio')) {
          const radios = formItem.querySelectorAll('.form__radio');
          radios.forEach(radio => {
            if(target === radio) {
              radio.parentNode.classList.add('active-radio');
            } else {
              radio.parentNode.classList.remove('active-radio');
            }
          })
        } else if (target.classList.contains('form__input')) {
          const checkboxes = formItem.querySelectorAll('.form__input');
          checkboxes.forEach(checkbox => {
            checkbox.classList.remove('active-checkbox');
            checkbox.checked = false;
            if (target === checkbox) {
              checkbox.classList.add('active-checkbox');
              checkbox.checked = true;
            }
          })
        } else {
          return;
        }

        inputsChecked.forEach(inputChecked => {
          if(target === inputChecked) {
            answerObj[`step${formIndex}`].answer.push(inputChecked.value);
          }
        });

        if (inputsChecked.length > 0){
          btnsNext[formIndex].disabled = false;
        } else {
          btnsNext[formIndex].disabled = true;
        }

        percentage.textContent = count;
      });


    });

    const formValidation = () => {
      const contactInputs = document.querySelectorAll('.quiz-form__block input:not(#quiz-policy)');
           let rez = false;

      contactInputs.forEach(input => {
        if(!input.value.trim()) {
          input.style.border = '1px solid crimson';
          rez = false;
          return;
        } else {
          rez = true;
          input.style.border = '';
        }
      })
      return rez;
    };

    const sendForm = () => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!formValidation()) {
          return;
        }

        answerObj.step4.name = document.querySelector('#quiz-name').value;
        answerObj.step4.phone = document.querySelector('#quiz-phone').value;
        answerObj.step4.email = document.querySelector('#quiz-email').value;
        answerObj.step4.call = document.querySelector('#quiz-call').value;

        if (document.querySelector('#quiz-policy').checked) {
          postData(answerObj)
            .then(res => {
              form.reset();
              // console.log(res);
            })
            .catch(err => console.log(err))
        } else {
          alert('Вы должны согласиться с обработкой данных');
        }
      });
    };

    sendForm();

    function generateMessage() {
      const parentBlock = document.querySelector('.quiz-form__block'),
            messageBlock = document.createElement('div');

      messageBlock.textContent = 'Сообщение отправлено';
      messageBlock.style.color = 'red';
      parentBlock.append(messageBlock);

      setTimeout( () => {
        messageBlock.remove();
      }, 5000)
    }

    const postData = async (data) => {
      const request = await fetch('server.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(data)
      })

      if(!request.ok) {
        throw new Error(`Could not fetch ${'server.php'}, status: ${request.status}`);
      }

      generateMessage();

      return await request.text();
    };

    overlay.style.display = 'none';
    quiz.style.display = 'none';

    passTestButton.onclick = () => {
      overlay.style.display = 'block';
      quiz.style.display = 'block';
    };

    

    function buttonAnimation() {
      const button = document.querySelector('.button-circl');
      const containerBtn = document.querySelector('.container-btn');
    
      function deleteCircle(circle) {
        circle.remove();
      }
    
      function createCircleIcon(posX, posY) {
        const circle = document.createElement('div');
        circle.classList.add('circle');
        circle.style.left = `${posX}px`;
        circle.style.top = `${posY}px`;
    
        containerBtn.appendChild(circle);
    
        setTimeout(()=> {
          deleteCircle(circle);
        }, 1000);
      }
    
      function handleButtonClick(event) {
        const offset = event.target.getBoundingClientRect(),
              posX =  event.pageX - offset.left,
              posY =  event.pageY - offset.top;
    
        createCircleIcon(posX, posY);
    
      }
    
      button.addEventListener('mousedown', handleButtonClick);
    }
    
    buttonAnimation(); 
});
